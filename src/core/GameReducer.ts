import type { Reducer } from "@castore/core";
import type { MyEventTypeDetails } from "../events";
import { createBoard } from "../utils/board-util";
import { distributePrizes } from "../utils/prize-util";
import { flipTile } from "../utils/tile-utils";
import type { GameAggregate } from "./GameAggregate";

export const gameReducer: Reducer<GameAggregate, MyEventTypeDetails> = (
  aggregate,
  event,
) => {
  const { version } = event;

  // if (event.metadata.handled) {
  //   console.warn("handled event... skip.");
  //   return aggregate;
  // }

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
      const { tileId, flippedBy } = event.payload;

      const tile = board?.tiles.find((t) => t.id === tileId);
      if (!tile) {
        throw new Error(`타일을 찾을 수 없습니다: ${tileId}`);
      }

      // 타일 뒤집기
      if (!tile.flipped) {
        flipTile(tile, flippedBy);
      }

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
