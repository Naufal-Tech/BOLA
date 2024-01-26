import express from "express";
import Controller from "../controllers/MatchCtrl.js";

const matchRouter = express.Router();

//CREATE (POST): /api/v1/match
matchRouter.post("/", Controller.create);

// POST DETAIL (GET): /api/v1/match/detail/:id
matchRouter.get("/detail/:id", Controller.detail);

// POST VIEW ALL (GET): /api/v1/match/api/v1
matchRouter.get("/", Controller.get);

export default matchRouter;
