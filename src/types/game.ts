import type { Tile } from "./tile";

/**
 * 게임 보드
 */
export type Board = {
  gameId: string;
  tiles: Tile[];
  width: number;
  height: number;
};

/**
 * 게임 상태
 */
export type Game = {
  gameId: string;
  board: Board | null;
  initialized: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
