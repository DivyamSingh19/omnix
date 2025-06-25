import {Hono} from "hono";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
  generateProposalSummary,
  addVoteToProposal,
} from "../controllers/proposal";


const proposalRoute = new Hono();

proposalRoute.get('/',getAllProposals);
proposalRoute.get('/:id', getProposalById);
proposalRoute.post('/create',createProposal);
proposalRoute.post('/:id/update-status', updateProposalStatus);
proposalRoute.post('/:id/summary', generateProposalSummary);
proposalRoute.post('/vote', addVoteToProposal);


export default proposalRoute;