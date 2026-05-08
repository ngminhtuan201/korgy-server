export enum SessionStatus {
  WAITING = "waiting",
  ACTIVE = "active",
  FINISHED = "finished",
}

export enum SessionEndCondition {
  TIME = "time",
  GOAL = "goal",
}

export enum SessionGame {
  QUIZ = "quiz",
  WHACK_A_BUG = "whack-a-bug", // Đập gián
  CHICKEN_TOSS = "chicken-toss", // Ném gà
}

export enum SessionPlayMode {
  SOLO = "solo",
  TEAM = "team",
}
