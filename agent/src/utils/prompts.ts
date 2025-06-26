export const summarizePrompt = ({ title, description }: any) =>
  `Summarize the following proposal in 2-3 lines:\n\nTitle: ${title}\nDescription: ${description}`;

export const processProposalPrompt = ({ title, description }: any) => `
You are an expert DAO agent. Analyze the following proposal and decide whether to vote YES or NO.

Proposal:
Title: ${title}
Description: ${description}

Respond in this format:
VOTE: [YES/NO]
REASON: [short explanation why]
`;

export const votePrompt = ({ title, description }: any) =>
  `Should the agent vote YES or NO on the following proposal?\n\nTitle: ${title}\nDescription: ${description}\n\nRespond with "yes" or "no".`;

export const grantPrompt = ({ goal, amount }: any) =>
  `Analyze this grant request:\n\nGoal: ${goal}\nAmount requested: ${amount}\n\nShould it be funded? Respond with "approve" or "reject".`;

export const gigMatchPrompt = ({
  proposalTitle,
  proposalDesc,
  gigTitle,
  gigDesc,
}: any) =>
  `Proposal:\nTitle: ${proposalTitle}\nDescription: ${proposalDesc}\n\nGig:\nTitle: ${gigTitle}\nDescription: ${gigDesc}\n\nIs this a good fit? Reply with "match" or "no match".`;

// summarizePrompt
// votePrompt
// grantPrompt
// gigMatchPrompt
