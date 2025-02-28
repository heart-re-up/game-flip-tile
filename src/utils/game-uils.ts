import type { GameState } from "../types/GameInstance";
import type { Settings } from "../types/settings";
import { generateId } from "./id";

export const createGame = (settings: Settings): GameState => {
  const gameId = generateId();
  const now = new Date();
  return {
    gameId,
    board: null,
    initialized: false,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const serializeGame = (state: GameState) => {
  return JSON.stringify(state);
};

export const deserializeGame = (state: string): GameState => {
  return JSON.parse(state);
};
