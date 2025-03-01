import type { Reducer } from "@castore/core";
import type { MyEventTypeDetails } from "../events";
import { createBoard } from "../utils/board-util";
import { distributePrizes } from "../utils/prize-util";
import type { GameAggregate } from "./GameAggregate";

/**
 * 게임 이벤트 리듀서
 *
 * 이벤트 리듀서는 상태를 가지지 않고 단순히 이벤트에 대한 처리 방법만 제공하기 때문에 재사용 가능합니다.
 *
 * @param aggregate 게임 집계
 * @param event 이벤트
 * @returns 업데이트된 게임 집계
 */
export const gameReducer: Reducer<GameAggregate, MyEventTypeDetails> = (
  aggregate,
  event,
) => {
  const { version } = event;

  // 이벤트 유형에 따른 처리
  switch (event.type) {
    case "INIT_GAME": {
      const { gameId, settings } = event.payload;
      const board = createBoard(gameId, settings.board); // 보드 생성
      board.tiles = distributePrizes(gameId, board.tiles, settings.prizes); // 상품 분배
      return {
        aggregateId: gameId,
        version,
        gameId,
        board,
        initialized: true,
        completed: false,
        createdAt: event.timestamp,
        updatedAt: event.timestamp,
      };
    }

    case "FLIP_TILE": {
      const { board } = aggregate;
      const { tileIndex, flippedBy } = event.payload;

      const tile = board?.tiles[tileIndex];
      if (!tile) {
        throw new Error(`타일[${tileIndex}]을 찾을 수 없습니다`);
      }

      // 타일 뒤집기
      tile.flipped = true;
      tile.flippedBy = flippedBy;
      tile.flippedAt = event.timestamp;

      return {
        ...aggregate,
        version,
        updatedAt: event.timestamp,
      };
    }

    default:
      return aggregate;
  }
};
