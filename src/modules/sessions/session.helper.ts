import { customAlphabet } from "nanoid";
import { Set, SetSnapshot } from "../../models";

const GAME_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GAME_CODE_LENGTH = 6;

export const generateGameCode = (): string => {
  return customAlphabet(GAME_CODE_ALPHABET, GAME_CODE_LENGTH)();
};

export const calculatePoints = (
  basePoints: number,
  isCorrect: boolean,
  timeSpent: number,
  timeLimit?: number,
): number => {
  if (!isCorrect) return 0;

  let points = basePoints;

  // Speed bonus: up to 50% extra if answered quickly
  if (timeLimit && timeLimit > 0) {
    const timeLimitMs = timeLimit * 1000;
    const speedRatio = Math.max(0, 1 - timeSpent / timeLimitMs);
    const speedBonus = Math.round(basePoints * 0.5 * speedRatio);
    points += speedBonus;
  }

  return points;
};

export const buildSetSnapshot = (
  set: Set,
  shuffleQuestions: boolean,
): SetSnapshot => ({
  id: set.id,
  name: set.name,
  thumbnailUrl: set.thumbnailUrl,
  questions: shuffleQuestions ? set.questions : set.questions,
});
