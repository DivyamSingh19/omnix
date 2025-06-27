export const summarizePrompt = ({ title, description }: any) =>
  `Summarize the following proposal in 2-3 lines. Title: ${title}. Description: ${description}.`;

export const processProposalPrompt = ({ title, description }: any) =>
  `You are an expert DAO agent. Analyze the following proposal and decide whether to vote YES or NO. Proposal Title: ${title}. Description: ${description}. Respond in this format: VOTE: [YES or NO]. REASON: [short explanation why].`;

export const votePrompt = ({ title, description }: any) =>
  `You are an autonomous voting agent reviewing the following proposal. Title: ${title}. Description: ${description}. Based on clarity, feasibility, and alignment with DAO goals, respond strictly in this format: VOTE: YES or NO. REASON: A concise explanation justifying your decision.`;

export const grantPrompt = ({ title, description, goal, amount }: any) =>
  `Analyze this grant request. Title: ${title}. Description: ${description}. Goal: ${goal}. Amount requested: ${amount}. Should it be funded? Respond with "approve" or "reject".`;

export const gigMatchPrompt = ({
  proposalTitle,
  proposalDesc,
  gigTitle,
  gigDesc,
}: any) =>
  `Proposal Title: ${proposalTitle}. Description: ${proposalDesc}. Gig Title: ${gigTitle}. Description: ${gigDesc}. Is this a good fit? Reply with "match" or "no match".`;
