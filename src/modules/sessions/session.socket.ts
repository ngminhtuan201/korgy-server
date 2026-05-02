import { Server as SocketIOServer, Socket } from "socket.io";
import { SessionModel, PlayerModel } from "../../models";

export const registerSessionSocketHandlers = (io: SocketIOServer) => {
  const sessionNamespace = io.of("/sessions");

  sessionNamespace.on("connection", (socket: Socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);

    // Join a session room
    socket.on(
      "session:join-room",
      async (data: { sessionId: string; playerId?: string }) => {
        const { sessionId, playerId } = data;
        const room = `session:${sessionId}`;
        await socket.join(room);
        socket.data.sessionId = sessionId;
        socket.data.playerId = playerId;

        // Notify others in the room
        socket.to(room).emit("session:player-joined", { playerId });
        console.log(`[socket] ${socket.id} joined room ${room}`);
      },
    );

    // Teacher starts the session
    socket.on("session:start", async (data: { sessionId: string }) => {
      const { sessionId } = data;
      const room = `session:${sessionId}`;

      const session = await SessionModel.findOne({ id: sessionId })
        .lean()
        .exec();
      if (!session) return;

      sessionNamespace.to(room).emit("session:started", {
        sessionId,
        currentQuestionIndex: session.currentQuestionIndex,
      });
    });

    // Move to next question
    socket.on("session:next-question", async (data: { sessionId: string }) => {
      const { sessionId } = data;
      const room = `session:${sessionId}`;

      const session = await SessionModel.findOne({ id: sessionId })
        .lean()
        .exec();
      if (!session) return;

      const question = session.snapshot.questions[session.currentQuestionIndex];
      if (!question) return;

      sessionNamespace.to(room).emit("session:question", {
        sessionId,
        questionIndex: session.currentQuestionIndex,
        question: {
          id: question.id,
          type: question.type,
          title: question.title,
          timeLimit: question.timeLimit,
          points: question.points,
          content: question.content,
        },
      });
    });

    // Student submits answer (optional: via socket instead of REST)
    socket.on(
      "session:submit-answer",
      async (data: {
        sessionId: string;
        playerId: string;
        questionId: string;
        answerData: unknown;
      }) => {
        // Answer handling is primarily done via REST API
        // This event can be used for real-time notifications
        const { sessionId } = data;
        const room = `session:${sessionId}`;
        socket.to(room).emit("session:answer-submitted", {
          playerId: data.playerId,
          questionId: data.questionId,
        });
      },
    );

    // Leaderboard update
    socket.on(
      "session:update-leaderboard",
      async (data: { sessionId: string }) => {
        const { sessionId } = data;
        const room = `session:${sessionId}`;

        const players = await PlayerModel.find({ sessionId })
          .sort({ score: -1, correctCount: -1 })
          .lean()
          .exec();

        const leaderboard = players.map((p, idx) => ({
          rank: idx + 1,
          playerId: p.id,
          nickname: p.nickname,
          score: p.score,
          correctCount: p.correctCount,
          totalAnswered: p.totalAnswered,
        }));

        sessionNamespace.to(room).emit("session:leaderboard", {
          sessionId,
          leaderboard,
        });
      },
    );

    // End session
    socket.on("session:end", async (data: { sessionId: string }) => {
      const { sessionId } = data;
      const room = `session:${sessionId}`;

      const players = await PlayerModel.find({ sessionId })
        .sort({ score: -1, correctCount: -1 })
        .lean()
        .exec();

      const leaderboard = players.map((p, idx) => ({
        rank: idx + 1,
        playerId: p.id,
        nickname: p.nickname,
        score: p.score,
        correctCount: p.correctCount,
        totalAnswered: p.totalAnswered,
      }));

      sessionNamespace.to(room).emit("session:ended", {
        sessionId,
        leaderboard,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[socket] Client disconnected: ${socket.id}`);
      // Optionally mark player as inactive
    });
  });
};
