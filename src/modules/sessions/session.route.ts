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
  getSessions,
  joinSession,
  nextQuestion,
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

// sessionRouter.get("/:id", authenticate(), getSessionReport);

sessionRouter.post(
  "/:id/join",
  validateRequestBody(joinSessionSchema),
  joinSession,
);

sessionRouter.post("/:id/start", authenticate(), startSession);

sessionRouter.post("/:id/next-question", authenticate(), nextQuestion);

sessionRouter.post(
  "/:id/answer",
  validateRequestBody(answerQuestionSchema),
  submitAnswer,
);

sessionRouter.post("/:id/end", authenticate(), endSession);

sessionRouter.get("/:id/leaderboard", authenticate(), getLeaderboard);

sessionRouter.get("/:id/results", authenticate(), getResults);
