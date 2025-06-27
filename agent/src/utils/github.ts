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

export const analyzeGitHubProfileViaAPI = async (
  username: string,
  githubToken?: string
): Promise<string> => {
  const cleanUsername = username.replace("@", "").trim();

  try {
    console.log(`Fetching GitHub profile for: ${cleanUsername}`);

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "GitHub-Profile-Analyzer",
    };

    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

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
    } catch (eventsError) {
      console.log("Could not fetch recent activity (might be private)");
    }

    const markdown = generateMarkdownProfile(user, repos, recentActivity);

    console.log(
      `Successfully generated GitHub profile analysis (${markdown.length} characters)`
    );
    return markdown;
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
        `GitHub API rate limit exceeded. Resets at ${resetTime}. Consider adding a GitHub token for higher limits.`
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

const generateMarkdownProfile = (
  user: GitHubUser,
  repos: GitHubRepo[],
  events: GitHubEvent[]
): string => {
  const joinDate = new Date(user.created_at).toLocaleDateString();
  const lastUpdate = new Date(user.updated_at).toLocaleDateString();

 
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

  const activitySummary = generateActivitySummary(events);

  let markdown = `# ${user.name || user.login} (@${user.login})

## Profile Overview
- **GitHub Profile**: [${user.html_url}](${user.html_url})
- **Member since**: ${joinDate}
- **Last active**: ${lastUpdate}`;

  if (user.bio) {
    markdown += `\n- **Bio**: ${user.bio}`;
  }

  if (user.company) {
    markdown += `\n- **Company**: ${user.company}`;
  }

  if (user.location) {
    markdown += `\n- **Location**: ${user.location}`;
  }

  if (user.blog) {
    markdown += `\n- **Website**: [${user.blog}](${
      user.blog.startsWith("http") ? user.blog : `https://${user.blog}`
    })`;
  }

  if (user.twitter_username) {
    markdown += `\n- **Twitter**: [@${user.twitter_username}](https://twitter.com/${user.twitter_username})`;
  }

  markdown += `

## GitHub Statistics
- **Public Repositories**: ${user.public_repos}
- **Public Gists**: ${user.public_gists}
- **Followers**: ${user.followers}
- **Following**: ${user.following}
- **Total Stars Received**: ${totalStars}
- **Total Forks**: ${totalForks}`;

  if (languages.length > 0) {
    markdown += `\n- **Primary Languages**: ${languages
      .slice(0, 5)
      .join(", ")}`;
  }

  if (originalRepos.length > 0) {
    markdown += `\n\n## Top Repositories\n`;

    originalRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .forEach((repo) => {
        markdown += `\n### [${repo.name}](${repo.html_url})`;
        if (repo.description) {
          markdown += `\n${repo.description}`;
        }
        markdown += `\n- **Language**: ${repo.language || "N/A"}`;
        markdown += `\n- **Stars**: ${repo.stargazers_count} | **Forks**: ${repo.forks_count}`;
        if (repo.topics && repo.topics.length > 0) {
          markdown += `\n- **Topics**: ${repo.topics.join(", ")}`;
        }
        markdown += `\n- **Last updated**: ${new Date(
          repo.updated_at
        ).toLocaleDateString()}\n`;
      });
  }

  if (activitySummary) {
    markdown += `\n## Recent Activity\n${activitySummary}`;
  }

  return markdown;
};

const generateActivitySummary = (events: GitHubEvent[]): string => {
  if (events.length === 0) {
    return "No recent public activity available.";
  }

  let summary = "";
  const recentEvents = events.slice(0, 5);

  recentEvents.forEach((event) => {
    const date = new Date(event.created_at).toLocaleDateString();
    const repoName = event.repo.name;

    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload.commits?.length || 1;
        summary += `- **${date}**: Pushed ${commitCount} commit${
          commitCount > 1 ? "s" : ""
        } to ${repoName}\n`;
        break;
      case "CreateEvent":
        summary += `- **${date}**: Created ${event.payload.ref_type} in ${repoName}\n`;
        break;
      case "IssuesEvent":
        summary += `- **${date}**: ${event.payload.action} issue in ${repoName}\n`;
        break;
      case "PullRequestEvent":
        summary += `- **${date}**: ${event.payload.action} pull request in ${repoName}\n`;
        break;
      case "ForkEvent":
        summary += `- **${date}**: Forked ${repoName}\n`;
        break;
      case "WatchEvent":
        summary += `- **${date}**: Starred ${repoName}\n`;
        break;
      default:
        summary += `- **${date}**: ${event.type.replace(
          "Event",
          ""
        )} activity in ${repoName}\n`;
    }
  });

  return summary;
};
