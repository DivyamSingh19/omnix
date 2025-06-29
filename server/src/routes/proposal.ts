import {Hono} from "hono";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
  addVoteToProposal,
} from "../controllers/proposal";


const proposalRoute = new Hono();

proposalRoute.get('/',getAllProposals);
proposalRoute.get('/:id', getProposalById);
proposalRoute.post('/create',createProposal);
proposalRoute.post('/:id/update-status', updateProposalStatus);
proposalRoute.post('/vote', addVoteToProposal);


export default proposalRoute;