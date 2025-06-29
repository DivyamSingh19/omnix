import { Hono } from "hono";
import { getAllGigs, postGig, updateGigStatus } from "../controllers/gig";

const gigRoute = new Hono();

gigRoute.get("/", getAllGigs);
gigRoute.post("/create", postGig);
gigRoute.post("/:/id/update-status", updateGigStatus);

export default gigRoute;
