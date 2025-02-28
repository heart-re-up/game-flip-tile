import { Command, tuple } from "@castore/core";
import { gameEventStore } from "../core/GameStore";
import { InitGameEventType } from "../events/InitGameEvent";
import type { GameState } from "../types/GameInstance";
import type { Settings } from "../types/settings";

type Input = { gameId: string; settings: Settings };
type Output = { gameState: GameState };

export const commandInitGame = new Command({
  commandId: "INIT_GAME",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(gameEventStore),
  // 👇 Code to execute
  handler: async (input: Input, [gameEventStore]): Promise<Output> => {
    const { gameId, settings } = input;
    const result = await gameEventStore.pushEvent({
      aggregateId: gameId,
      version: 1,
      type: InitGameEventType.type,
      payload: { gameId, settings },
      metadata: {},
    });
    const nextAggregate = result.nextAggregate;
    console.log("initilized game: ", nextAggregate?.gameId);
    // nextAggregate?.board?.tiles.forEach((tile) => {
    //   console.log(`tile[${tile.index}]:`, tile.prize?.name);
    // });
    return { gameState: nextAggregate as GameState };
  },
});
