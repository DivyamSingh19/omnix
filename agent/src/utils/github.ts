import axios from "axios";

interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  company: string;
  location: string;
  email: string;
  blog: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  topics: string[];
  fork: boolean;
}

interface GitHubEvent {
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  payload: any;
}

interface ContributionsResponse {
  total: Record<string, number>;
}

export const analyzeGitHubProfileViaAPI = async (
  username: string,
): Promise<ReturnType<typeof generateStructuredProfile>> => {
  const cleanUsername = username.replace("@", "").trim();

  try {
    console.log(`Fetching GitHub profile for: ${cleanUsername}`);

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Profile-Analyzer",
    };


    const { data: user } = await axios.get<GitHubUser>(
      `https://api.github.com/users/${cleanUsername}`,
      { headers, timeout: 10000 }
    );

    const { data: repos } = await axios.get<GitHubRepo[]>(
      `https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=10`,
      { headers, timeout: 10000 }
    );

    let recentActivity: GitHubEvent[] = [];
    try {
      const { data: events } = await axios.get<GitHubEvent[]>(
        `https://api.github.com/users/${cleanUsername}/events/public?per_page=10`,
        { headers, timeout: 10000 }
      );
      recentActivity = events;
    } catch (activityError: any) {
      console.warn(
        `Could not fetch recent activity for ${cleanUsername}: ${activityError.message} (might be private or API issue)`
      );
    }

    const contributionBreakdownByYear = await fetchContributions(
      cleanUsername
    );

    const profile = generateStructuredProfile(
      user,
      repos,
      recentActivity,
      contributionBreakdownByYear
    );

    console.log(
      `Successfully generated GitHub profile analysis for ${profile.username}`
    );
    return profile;
  } catch (error: any) {
    console.error("GitHub API error:", error.message);

    if (error.response?.status === 404) {
      throw new Error(`GitHub user '${cleanUsername}' not found`);
    }

    if (error.response?.status === 403) {
      const rateLimitReset = error.response.headers["x-ratelimit-reset"];
      const resetTime = rateLimitReset
        ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
        : "unknown";
      throw new Error(
        `GitHub API rate limit exceeded. Resets at ${resetTime}. Consider adding a GitHub token.`
      );
    }

    if (error.response?.status >= 500) {
      throw new Error(
        "GitHub API is currently unavailable. Please try again later."
      );
    }

    throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
  }
};

const fetchContributions = async (
  username: string
): Promise<Record<string, number>> => {
  try {
    const { data } = await axios.get<ContributionsResponse>(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );

    const yearWise: Record<string, number> = data?.total || {};
    return yearWise;
  } catch (err: any) {
    console.error(
      "Failed to fetch all-time contributions from jogruber API:",
      err.message
    );
    if (axios.isAxiosError(err) && err.response) {
      console.error("Jogruber API error response status:", err.response.status);
      console.error("Jogruber API error response data:", err.response.data);
    }
    return {};
  }
};

const generateStructuredProfile = (
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[],
  contributionBreakdownByYear: Record<string, number>
) => {
  const joinDate = new Date(user.created_at).toISOString();
  const lastUpdate = new Date(user.updated_at).toISOString();

  const originalRepos = repos.filter((repo) => !repo.fork);
  const languages = [
    ...new Set(originalRepos.map((repo) => repo.language).filter(Boolean)),
  ];

  const totalStars = originalRepos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalForks = originalRepos.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );

  return {
    username: user.login,
    name: user.name || user.login,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,
    bio: user.bio || "",
    company: user.company || "",
    location: user.location || "",
    website: user.blog,
    twitter: user.twitter_username,
    memberSince: joinDate,
    lastActive: lastUpdate,
    stats: {
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
      primaryLanguages: languages.slice(0, 5),
      contributionBreakdownByYear: contributionBreakdownByYear,
    },
    topRepositories: originalRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        lastUpdated: new Date(repo.updated_at).toISOString(),
        url: repo.html_url,
      })),
    recentActivity: events.slice(0, 5).map((event) => {
      const date = new Date(event.created_at).toISOString();
      const repo = event.repo.name;

      let action = "";
      switch (event.type) {
        case "PushEvent":
          const commitCount = event.payload.commits?.length || 1;
          action = `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""}`;
          break;
        case "CreateEvent":
          action = `Created ${event.payload.ref_type}`;
          break;
        case "IssuesEvent":
          action = `${event.payload.action} issue`;
          break;
        case "PullRequestEvent":
          action = `${event.payload.action} pull request`;
          break;
        case "ForkEvent":
          action = `Forked`;
          break;
        case "WatchEvent":
          action = `Starred`;
          break;
        default:
          action = `${event.type.replace("Event", "")} activity`;
      }

      return { date, repo, action };
    }),
  };
};
