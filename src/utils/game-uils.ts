import type { Game } from "../types/game";
import type { Settings } from "../types/settings";
import { generateId } from "./id";

export const createGame = (settings: Settings): Game => {
  const gameId = generateId();
  const now = new Date().toISOString();
  return {
    gameId,
    board: null,
    initialized: false,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const serializeGame = (state: Game) => {
  return JSON.stringify(state);
};

export const deserializeGame = (state: string): Game => {
  return JSON.parse(state);
};
