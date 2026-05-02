import { Request, Response } from "express";
import {
  catchAsync,
  getCurrentUser,
  getPageNumber,
  getPageSize,
  getSortField,
  getSortOrder,
  handleSuccess,
} from "../../libs";
import { AnswerQuestionDto, CreateSessionDto, JoinSessionDto } from "./dtos";
import * as sessionService from "./session.service";

export const createSession = catchAsync(async (req: Request, res: Response) => {
  const dto = req.body as CreateSessionDto;
  const user = getCurrentUser(req);
  const newSession = await sessionService.createSession(user.id, dto);
  return handleSuccess(res, { newSession }, 201);
});

export const getSessions = catchAsync(async (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const pageSize = getPageSize(req);
  const pageNumber = getPageNumber(req);
  const sortField = getSortField(req);
  const sortOrder = getSortOrder(req) as "asc" | "desc";

  const paginatedSessions = await sessionService.getSessionsByUser(
    user.id,
    pageSize,
    pageNumber,
    sortField,
    sortOrder,
  );

  return handleSuccess(res, { paginatedSessions });
});

export const getSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await sessionService.getSessionById(id as string);
  return handleSuccess(res, { session });
});

export const joinSession = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.id as string;
  const dto = req.body as JoinSessionDto;
  const user = req?.user ? getCurrentUser(req) : undefined;
  const sessionCookieKey = `korgy-${sessionId}`;
  const sessionCookie = req.cookies[sessionCookieKey] as string;
  const clientId = sessionCookie.split("-")[1];
  const player = await sessionService.joinSession(
    sessionId,
    dto,
    clientId,
    user?.id,
  );

  res.cookie(sessionCookieKey, player.clientId);

  return handleSuccess(res, { player }, 201);
});

export const startSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const session = await sessionService.startSession(id as string, user.id);
  return handleSuccess(res, { session });
});

export const nextQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const session = await sessionService.nextQuestion(id as string, user.id);
  return handleSuccess(res, { session });
});

export const submitAnswer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { playerId } = req.body as { playerId: string };
  const dto = req.body as AnswerQuestionDto;
  const answer = await sessionService.submitAnswer(id as string, playerId, dto);
  return handleSuccess(res, { answer }, 201);
});

export const endSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const session = await sessionService.endSession(id as string, user.id);
  return handleSuccess(res, { session });
});

export const getLeaderboard = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const leaderboard = await sessionService.getLeaderboard(id as string);
    return handleSuccess(res, { leaderboard });
  },
);

export const getResults = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const results = await sessionService.getSessionResults(id as string, user.id);
  return handleSuccess(res, { results });
});
