import { Router } from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import {
  answerQuestionSchema,
  createSessionSchema,
  joinSessionSchema,
} from "./dtos";
import {
  createSession,
  endSession,
  getLeaderboard,
  getResults,
  getSession,
  getSessionByCode,
  getSessions,
  joinSession,
  startSession,
  submitAnswer,
} from "./session.controller";

export const sessionRouter = Router();

sessionRouter.post(
  "/",
  authenticate(),
  validateRequestBody(createSessionSchema),
  createSession,
);

sessionRouter.get("/", authenticate(), getSessions);

sessionRouter.get("/:id", authenticate(), getSession);

sessionRouter.get("/join/:code", getSessionByCode);

sessionRouter.post(
  "/:id/join",
  validateRequestBody(joinSessionSchema),
  joinSession,
);

sessionRouter.post("/:id/start", authenticate(), startSession);

sessionRouter.post(
  "/:id/answer",
  validateRequestBody(answerQuestionSchema),
  submitAnswer,
);

sessionRouter.post("/:id/end", authenticate(), endSession);

sessionRouter.get("/:id/leaderboard", authenticate(), getLeaderboard);

sessionRouter.get("/:id/results", authenticate(), getResults);
