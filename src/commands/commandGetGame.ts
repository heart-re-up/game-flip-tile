import { Command, tuple } from "@castore/core";
import { gameEventStore } from "../core/GameStore";
import type { GameState } from "../types/GameInstance";

type Input = { gameId: string };
type Output = { gameState: GameState };

export const commandGetGame = new Command({
  commandId: "GET_GAME",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(gameEventStore),
  // 👇 Code to execute
  handler: async (input: Input, [gameEventStore]): Promise<Output> => {
    const { gameId } = input;
    const { aggregate: gameState } = await gameEventStore.getAggregate(gameId);
    if (gameState === undefined) {
      throw new Error("Game not found");
    }
    return { gameState };
  },
});
