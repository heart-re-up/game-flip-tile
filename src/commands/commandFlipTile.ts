import { Command, tuple } from "@castore/core";
import { gameEventStore } from "../core/GameStore";
import {
  FlipTileEventType,
  type FlipTileEventDetail,
} from "../events/FlipTileEvent";
import type { Tile } from "../types/tile";

type Input = FlipTileEventDetail["payload"] & { gameId: string };
type Output = { tile: Tile | undefined };

export const commandFlipTile = new Command({
  commandId: "FLIP_TILE",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(gameEventStore),
  // 👇 Code to execute
  handler: async (input: Input, [gameEventStore]): Promise<Output> => {
    const { gameId, ...payload } = input;

    // 현재 게임 상태 확인
    const { aggregate } = await gameEventStore.getAggregate(gameId);
    const tile = aggregate?.board?.tiles.find((t) => t.id === payload.tileId);
    // 이미 뒤집힌 타일인지 확인
    if (tile?.flipped) {
      return { tile };
    }

    const version = aggregate?.version ?? 1;
    const result = await gameEventStore.pushEvent({
      aggregateId: gameId,
      version: version + 1,
      type: FlipTileEventType.type,
      payload,
      metadata: {},
    });

    // 업데이트된 게임 상태 가져오기
    console.log("nextAggregate", result.nextAggregate);
    const updatedTile = result.nextAggregate?.board?.tiles.find(
      (tile) => tile.id === payload.tileId,
    );
    return {
      tile: updatedTile,
    };
  },
});
