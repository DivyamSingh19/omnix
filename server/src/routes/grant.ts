import { Hono } from "hono";
import {
  assignGrantToProposal,
  createGrant,
  getAllGrants,
  getGrantById,
  updateGrantStatus,
} from "../controllers/grant";

const grantRoute = new Hono();

grantRoute.get("/", getAllGrants);
grantRoute.get("/:id", getGrantById);
grantRoute.post("/create", createGrant);
grantRoute.post("/:id/update-status", updateGrantStatus);
grantRoute.post("/assign", assignGrantToProposal);

export default grantRoute;
