import httpStatus from "http-status";

const ERROR_MESSAGE_CODE = {
  Forbidden: "FORBIDDEN",
  Unauthorized: "UNAUTHORIZED",
  BadRequest: "BAD_REQUEST",
  ServiceUnavailable: "SERVICE_UNAVAILABLE",

  EmailTaken: "EMAIL_TAKEN",
  InvalidCredentials: "INVALID_CREDENTIALS",
  TokenExpired: "TOKEN_EXPIRED",
  UnverifiedAccount: "UNVERIFIED_ACCOUNT",
  ValidationFailed: "VALIDATION_FAILED",
  FileMissing: "FILE_MISSING",
  UserNotFound: "USER_NOT_FOUND",

  SetNotFound: "SET_NOT_FOUND",
  ClassNotFound: "CLASS_NOT_FOUND",
  InvalidClassCode: "INVALID_CLASS_CODE",
  AlreadyJoinedClass: "ALREADY_JOINED_CLASS",

  SessionNotFound: "SESSION_NOT_FOUND",
  InvalidGameCode: "INVALID_GAME_CODE",
  SessionNotWaiting: "SESSION_NOT_WAITING",
  SessionNotActive: "SESSION_NOT_ACTIVE",
  SessionAlreadyStarted: "SESSION_ALREADY_STARTED",
  SessionAlreadyFinished: "SESSION_ALREADY_FINISHED",
  PlayerAlreadyJoined: "PLAYER_ALREADY_JOINED",
  QuestionNotFound: "QUESTION_NOT_FOUND",
  NotSessionOwner: "NOT_SESSION_OWNER",
  NicknameTaken: "NICKNAME_TAKEN",
  AnswerAlreadySubmitted: "ANSWER_ALREADY_SUBMITTED",
  PlayerNotFound: "PLAYER_NOT_FOUND",
};

export class AppError extends Error {
  statusCode: number;
  messageCode: string;
  message: string;

  constructor(statusCode: number, messageCode: string, message: string) {
    super();
    this.statusCode = statusCode;
    this.messageCode = messageCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createError = (
  statusCode: number,
  messageCode: string,
  message: string,
) => {
  return new AppError(statusCode, messageCode, message);
};

export const errors = {
  BadRequest: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.BadRequest,
    "The request is invalid.",
  ),
  Unauthorized: createError(
    httpStatus.UNAUTHORIZED,
    ERROR_MESSAGE_CODE.Unauthorized,
    "The request has not been authenticated.",
  ),
  Forbidden: createError(
    httpStatus.FORBIDDEN,
    ERROR_MESSAGE_CODE.Forbidden,
    "The request is forbidden.",
  ),
  ServiceUnavailable: createError(
    httpStatus.SERVICE_UNAVAILABLE,
    ERROR_MESSAGE_CODE.ServiceUnavailable,
    "The service is unavailable.",
  ),

  TokenExpired: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.TokenExpired,
    "Session expired. Please login again.",
  ),
  ValidationFailed: (details?: string) =>
    createError(
      httpStatus.BAD_REQUEST,
      ERROR_MESSAGE_CODE.ValidationFailed,
      details || "Fail to validate your request's data.",
    ),
  InvalidCredentials: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.InvalidCredentials,
    "Invalid credentials.",
  ),
  EmailTaken: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.EmailTaken,
    "The email has been taken.",
  ),
  UnverifiedAccount: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.UnverifiedAccount,
    "The account has not been verified.",
  ),
  FileMissing: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.FileMissing,
    "No file provided",
  ),
  UserNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.UserNotFound,
    "User not found.",
  ),

  SetNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.SetNotFound,
    "Set not found.",
  ),
  ClassNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.ClassNotFound,
    "Class not found.",
  ),
  InvalidClassCode: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.InvalidClassCode,
    "Invalid class code.",
  ),
  AlreadyJoinedClass: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.AlreadyJoinedClass,

    "You have already joined this class.",
  ),

  SessionNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.SessionNotFound,
    "Session not found.",
  ),
  InvalidGameCode: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.InvalidGameCode,
    "Invalid game code.",
  ),
  SessionNotWaiting: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.SessionNotWaiting,
    "Session is not in waiting status.",
  ),
  SessionNotActive: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.SessionNotActive,
    "Session is not active.",
  ),
  SessionAlreadyStarted: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.SessionAlreadyStarted,
    "Session has already started.",
  ),
  SessionAlreadyFinished: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.SessionAlreadyFinished,
    "Session has already finished.",
  ),
  PlayerAlreadyJoined: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.PlayerAlreadyJoined,
    "You have already joined this session.",
  ),
  QuestionNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.QuestionNotFound,
    "Question not found.",
  ),
  NotSessionOwner: createError(
    httpStatus.FORBIDDEN,
    ERROR_MESSAGE_CODE.NotSessionOwner,
    "You are not the owner of this session.",
  ),
  NicknameTaken: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.NicknameTaken,
    "This nickname is already taken in this session.",
  ),
  AnswerAlreadySubmitted: createError(
    httpStatus.BAD_REQUEST,
    ERROR_MESSAGE_CODE.AnswerAlreadySubmitted,
    "You have already submitted an answer for this question.",
  ),
  PlayerNotFound: createError(
    httpStatus.NOT_FOUND,
    ERROR_MESSAGE_CODE.PlayerNotFound,
    "Player not found in this session.",
  ),
};
