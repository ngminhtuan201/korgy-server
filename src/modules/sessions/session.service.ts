import { SessionStatus } from "../../enums";
import { errors } from "../../errors";
import { createPaginatedItems, documentId } from "../../libs";
import {
  Answer,
  AnswerModel,
  Player,
  PlayerModel,
  Session,
  SessionModel,
  Set,
  SetModel,
  SetSnapshot,
} from "../../models";
import { AnswerQuestionDto, CreateSessionDto, JoinSessionDto } from "./dtos";
import {
  buildSetSnapshot,
  calculatePoints,
  generateGameCode,
} from "./session.helper";

export const createSession = async (
  userId: string,
  dto: CreateSessionDto,
): Promise<Session> => {
  const set = (await SetModel.findOne({ id: dto.setId }).lean().exec()) as Set;
  if (!set || (set.userId !== userId && !set.isPublic)) {
    throw errors.SetNotFound;
  }

  // Generate unique game code
  let joinCode = generateGameCode();
  let existing = await SessionModel.findOne({ joinCode }).lean().exec();
  while (existing) {
    joinCode = generateGameCode();
    existing = await SessionModel.findOne({ joinCode }).lean().exec();
  }

  const setSnapshot: SetSnapshot = buildSetSnapshot(
    set,
    dto?.shuffleQuestions ?? false,
  );
  const newSession: Session = {
    id: documentId(),
    userId: userId,
    set: setSnapshot,
    game: dto.game,
    joinCode: joinCode,
    status: SessionStatus.WAITING,
    shuffleQuestions: dto.shuffleQuestions,
    endCondition: dto.endCondition,
    duration: dto?.duration || 0,
    loginRequired: dto.loginRequired,
    allowLateJoining: dto.allowLateJoining,
    playMode: dto.playMode,
  };

  await SessionModel.create(newSession);

  return newSession;
};

export const getSessionsByUser = async (
  userId: string,
  pageSize: number,
  pageNumber: number,
  sortField: string,
  sortOrder: "asc" | "desc",
) => {
  const skip = (pageNumber - 1) * pageSize;

  const [sessions, totalItems] = await Promise.all([
    SessionModel.find({ userId })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec(),
    SessionModel.countDocuments({ userId }).exec(),
  ]);

  return createPaginatedItems(sessions, totalItems, pageSize, pageNumber);
};

export const getSessionById = async (sessionId: string): Promise<Session> => {
  const session = (await SessionModel.findOne({ id: sessionId })
    .lean()
    .exec()) as Session;

  if (!session) {
    throw errors.SessionNotFound;
  }

  return session;
};

export const getSessionByGameCode = async (
  joinCode: string,
): Promise<Session> => {
  const session = (await SessionModel.findOne({
    joinCode: joinCode.toUpperCase(),
  })
    .lean()
    .exec()) as Session;
  if (!session) {
    throw errors.InvalidGameCode;
  }

  return session;
};

export const joinSession = async (
  sessionId: string,
  dto: JoinSessionDto,
  clientId?: string,
  userId?: string,
): Promise<Player> => {
  const session = await getSessionById(sessionId);

  if (session.status === SessionStatus.FINISHED) {
    throw errors.SessionAlreadyFinished;
  }

  if (session.loginRequired && !userId) {
    throw errors.Forbidden;
  }

  let player: Player;

  // Check if user already joined
  if (clientId) {
    player = (await PlayerModel.findOne({
      sessionId,
      clientId,
    })
      .lean()
      .exec()) as Player;
  }

  if (player) {
    if (userId && userId !== player?.userId) {
      player.userId = userId;
      await PlayerModel.updateOne(
        { id: player.id },
        { $set: { userId: userId } },
      );
    }
  } else {
    clientId = crypto.randomUUID();
    player = {
      id: documentId(),
      sessionId,
      nickname: dto.nickname,
      userId,
      score: 0,
      correctCount: 0,
      totalAnswered: 0,
      joinedAt: new Date(),
      isActive: true,
      clientId,
    };

    await PlayerModel.create(player);
  }

  return player;
};

export const startSession = async (
  sessionId: string,
  userId: string,
): Promise<Session> => {
  const session = await getSessionById(sessionId);

  if (session.userId !== userId) {
    throw errors.Forbidden;
  }

  if (session.status !== SessionStatus.WAITING) {
    throw errors.SessionNotWaiting;
  }

  const updatedSession = (await SessionModel.findOneAndUpdate(
    { id: sessionId },
    {
      $set: {
        status: SessionStatus.ACTIVE,
        startedAt: new Date(),
        currentQuestionIndex: 0,
      },
    },
    { new: true },
  )
    .lean()
    .exec()) as Session;

  return updatedSession;
};

// export const nextQuestion = async (
//   sessionId: string,
//   userId: string,
// ): Promise<Session> => {
//   const session = await getSessionById(sessionId);

//   if (session.userId !== userId) {
//     throw errors.NotSessionOwner;
//   }

//   if (session.status !== SessionStatus.ACTIVE) {
//     throw errors.SessionNotActive;
//   }

//   const nextIndex = session.currentQuestionIndex + 1;
//   if (nextIndex >= session.snapshot.questions.length) {
//     // No more questions, end session
//     return endSession(sessionId, userId);
//   }

//   const updatedSession = (await SessionModel.findOneAndUpdate(
//     { id: sessionId },
//     { $set: { currentQuestionIndex: nextIndex } },
//     { new: true },
//   )
//     .lean()
//     .exec()) as Session;

//   return updatedSession;
// };

export const submitAnswer = async (
  sessionId: string,
  playerId: string,
  dto: AnswerQuestionDto,
): Promise<Answer> => {
  const session = await getSessionById(sessionId);

  if (session.status !== SessionStatus.ACTIVE) {
    throw errors.SessionNotActive;
  }

  // Verify player belongs to session
  const player = await PlayerModel.findOne({ id: playerId, sessionId })
    .lean()
    .exec();
  if (!player) {
    throw errors.PlayerNotFound;
  }

  // Find question in snapshot
  const question = session.set.questions.find((q) => q.id === dto.questionId);
  if (!question) {
    throw errors.QuestionNotFound;
  }

  // Check if answer already submitted
  const existingAnswer = await AnswerModel.findOne({
    sessionId,
    playerId,
    questionId: dto.questionId,
  })
    .lean()
    .exec();
  if (existingAnswer) {
    throw errors.AnswerAlreadySubmitted;
  }

  // Calculate correctness and points
  // const isCorrect = checkAnswerCorrectness(
  //   question.type,
  //   question.content,
  //   dto.answerData,
  // );

  const isCorrect = true;

  // For timeSpent, we'd ideally track from question start; for now use 0 if not provided
  const timeSpent = 0;
  const points = calculatePoints(
    question.points,
    isCorrect,
    timeSpent,
    question.timeLimit,
  );

  const answer: Answer = {
    id: documentId(),
    sessionId,
    playerId,
    questionId: dto.questionId,
    answerData: dto.answerData,
    isCorrect,
    points,
    timeSpent,
    answeredAt: new Date(),
  };

  await AnswerModel.create(answer);

  // Update player stats
  await PlayerModel.findOneAndUpdate(
    { id: playerId },
    {
      $inc: {
        score: points,
        correctCount: isCorrect ? 1 : 0,
        totalAnswered: 1,
      },
    },
  );

  return answer;
};

export const endSession = async (
  sessionId: string,
  userId: string,
): Promise<Session> => {
  const session = await getSessionById(sessionId);

  if (session.userId !== userId) {
    throw errors.NotSessionOwner;
  }

  if (session.status === SessionStatus.FINISHED) {
    throw errors.SessionAlreadyFinished;
  }

  const updatedSession = (await SessionModel.findOneAndUpdate(
    { id: sessionId },
    {
      $set: {
        status: SessionStatus.FINISHED,
        endedAt: new Date(),
      },
    },
    { new: true },
  )
    .lean()
    .exec()) as Session;

  return updatedSession;
};

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  nickname: string;
  score: number;
  correctCount: number;
  totalAnswered: number;
  accuracy: number;
}

export const getLeaderboard = async (
  sessionId: string,
): Promise<LeaderboardEntry[]> => {
  const session = await getSessionById(sessionId);

  const players = await PlayerModel.find({ sessionId })
    .sort({ score: -1, correctCount: -1 })
    .lean()
    .exec();

  const totalQuestions = session.set.questions.length;

  return players.map((player, index) => ({
    rank: index + 1,
    playerId: player.id,
    nickname: player.nickname,
    score: player.score,
    correctCount: player.correctCount,
    totalAnswered: player.totalAnswered,
    accuracy:
      totalQuestions > 0
        ? Math.round((player.correctCount / totalQuestions) * 100)
        : 0,
  }));
};

export interface QuestionResult {
  questionId: string;
  title: string;
  type: string;
  points: number;
  playerAnswers: Array<{
    playerId: string;
    nickname: string;
    answerData: unknown;
    isCorrect: boolean;
    points: number;
    timeSpent: number;
  }>;
}

export interface SessionResults {
  sessionId: string;
  setName: string;
  totalQuestions: number;
  players: LeaderboardEntry[];
  questionResults: QuestionResult[];
}

export const getSessionResults = async (
  sessionId: string,
  userId: string,
): Promise<SessionResults> => {
  const session = await getSessionById(sessionId);

  if (session.userId !== userId) {
    throw errors.NotSessionOwner;
  }

  const players = await PlayerModel.find({ sessionId }).lean().exec();
  const answers = await AnswerModel.find({ sessionId }).lean().exec();

  const playerMap = new Map(players.map((p) => [p.id, p]));

  const questionResults: QuestionResult[] = session.set.questions.map((q) => {
    const questionAnswers = answers.filter((a) => a.questionId === q.id);
    return {
      questionId: q.id,
      title: q.title,
      type: q.type,
      points: q.points,
      playerAnswers: questionAnswers.map((a) => ({
        playerId: a.playerId,
        nickname: playerMap.get(a.playerId)?.nickname || "Unknown",
        answerData: a.answerData,
        isCorrect: a.isCorrect,
        points: a.points,
        timeSpent: a.timeSpent,
      })),
    };
  });

  const leaderboard = await getLeaderboard(sessionId);

  return {
    sessionId: session.id,
    setName: session.set.name,
    totalQuestions: session.set.questions.length,
    players: leaderboard,
    questionResults,
  };
};
