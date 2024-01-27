import clubRouter from "./routes/Club.js";
import matchRouter from "./routes/Match.js";
import standingsRouter from "./routes/Standings.js";
import userRouter from "./routes/User.js";

const routes = (app) => {
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/match", matchRouter);
  app.use("/api/v1/club", clubRouter);
  app.use("/api/v1/standings", standingsRouter);
};

export default routes;
