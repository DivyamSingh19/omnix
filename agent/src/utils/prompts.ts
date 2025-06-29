export const analyzeProposalPrompt = ({ title, description }: any) =>
  `You are a DAO governance agent. Your task is to:
1. Provide a 2–3 sentence summary of the proposal.
2. Identify any similar existing projects in the ecosystem.
3. Evaluate the proposal for:
   - Clarity and feasibility
   - Alignment with DAO goals
   - Strengths and weaknesses
Proposal Title: ${title}
Proposal Description: ${description}
Format your response as plain text with no markdown, no bullet points, no numbered lists, and no special formatting characters.Use only regular sentences and paragraphs.`;

export const votePrompt = ({ title, description, goal, amount }: any) =>
  `You are an autonomous voting agent reviewing the following proposal. Title: ${title}. Description: ${description} Goal:${goal} Amount:${amount}. Based on clarity, feasibility, and alignment with DAO goals, respond strictly in this format: VOTE: YES or NO. REASON: A concise explanation justifying your decision.Format your response as plain text with no markdown, no bullet points, no numbered lists, and no special formatting characters.Use only regular sentences and paragraphs.`;

export const grantPrompt = ({
  title,
  description,
  goal,
  amount,
  scorepfp,
}: {
  title: string;
  description: string;
  goal: string;
  amount: number;
  scorepfp: number;
}) =>
  `Analyze this grant request. 
Title: ${title}. 
Description: ${description}. 
Goal: ${goal}. 
Amount requested: ${amount}. 
GitHub activity score: ${scorepfp}/10. 
This score reflects the applicant’s open-source activity level.Should this grant be approved? Respond with "approve" or "reject".Format your response as plain text with no markdown, no bullet points, no numbered lists, and no special formatting characters.Use only regular sentences and paragraphs.`;

export const gigMatchPrompt = ({
  proposalTitle,
  proposalDesc,
  gigTitle,
  gigDesc,
}: any) =>
  `Proposal Title: ${proposalTitle}. Description: ${proposalDesc}. Gig Title: ${gigTitle}. Description: ${gigDesc}. Is this a good fit? Reply with "match" or "no match".Format your response as plain text with no markdown, no bullet points, no numbered lists, and no special formatting characters.Use only regular sentences and paragraphs.`;

export const scoreProfile = ({
  username,
  contributionsByYear,
}: {
  username: string;
  contributionsByYear: Record<string, number>;
}): number => {
  const years = Object.keys(contributionsByYear).sort();
  const now = new Date().getFullYear();

  let score = 0;
  let totalWeighted = 0;
  let totalContributions = 0;

  for (const year of years) {
    const yearNum = parseInt(year);
    const contrib = contributionsByYear[year];
    const weight = Math.max(1, 4 - (now - yearNum));
    totalWeighted += contrib * weight;
    totalContributions += contrib;
  }

  score = totalWeighted / 400;

  const consistentYears = Object.values(contributionsByYear).filter(
    (c) => c >= 300
  ).length;
  if (consistentYears >= 2) score += 1;

  return Math.min(10, Math.round(score));
};

export const rewriteprompt = ({ field, value }:any) => 
  `Rewrite this ${field} to make it clearer, more compelling, and professional:\n\n${value}\n\nReturn only the rewritten ${field}.Format your response as plain text with no markdown, no bullet points, no numbered lists, and no special formatting characters.Use only regular sentences and paragraphs.`;
