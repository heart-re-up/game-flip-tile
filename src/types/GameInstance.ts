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

export type GameState = {
  gameId: string;
  board: Board | null;
  initialized: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GameSnapshot = {
  /** 스냅샷 ID */
  snapshotId: string;
  /** 게임 ID */
  gameId: string;
  /** 스냅샷 시점의 이벤트 인덱스 */
  eventIndex: number;
  /** 게임 상태 */
  state: GameState;
  /** 스냅샷 생성 시간 */
  createdAt: Date;
};
