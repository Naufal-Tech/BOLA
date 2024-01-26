import express from "express";
import Controller from "../controllers/StandingsCtrl.js";

const standingsRouter = express.Router();

//CREATE (POST): /api/v1/match
standingsRouter.get("/", Controller.get);

export default standingsRouter;
