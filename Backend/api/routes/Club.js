import express from "express";
import Controller from "../controllers/ClubCtrl.js";
import { upload } from "../middleware/multerMiddleware.js";
import { validateClub } from "../models/club.js";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, //15 menit
  max: 10, // ten request max in 15 menit
  message:
    "Too many requests from this IP address, please try again after 15 minutes",
});

// Pakai Express Router
const clubRouter = express.Router();

//POST: /api/v1/club
clubRouter.post(
  "/",
  upload.single("img_club"),
  validateClub,
  Controller.create
);

//GET: /api/v1/club
clubRouter.get("/", Controller.get);

export default clubRouter;
