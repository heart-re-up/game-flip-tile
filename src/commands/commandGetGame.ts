import { Command, tuple } from "@castore/core";
import { eventStore } from "../core/GameEventStore";
import type { Game } from "../types/game";

type Input = { gameId: string };
type Output = { gameState: Game };

export const CommandGetGame = new Command({
  commandId: "GET_GAME",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(eventStore),
  // 👇 Code to execute
  handler: async (input: Input, [eventStore]): Promise<Output> => {
    const { gameId } = input;
    const { aggregate: gameState } = await eventStore.getAggregate(gameId);
    if (gameState === undefined) {
      throw new Error("Game not found");
    }
    return { gameState };
  },
});
