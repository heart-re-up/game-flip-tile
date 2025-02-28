import { commandFlipTile } from "../commands/commandFlipTile";
import { commandGetGame } from "../commands/commandGetGame";
import { commandInitGame } from "../commands/commandInitGame";
import type { MyEventTypeDetails } from "../events";
import type { Settings } from "../types/settings";
import { gameEventStore } from "./GameStore";

export const game = {
  init: async (gameId: string, settings: Settings) =>
    commandInitGame.handler({ gameId, settings }, [gameEventStore]),
  getGame: async (gameId: string) =>
    commandGetGame.handler({ gameId }, [gameEventStore]),
  flipTile: async (gameId: string, tileId: string, userId: string) =>
    commandFlipTile.handler({ gameId, tileId, flippedBy: userId }, [
      gameEventStore,
    ]),
};

export const gameService = {
  save: async (gameId: string) => {
    const events = await gameEventStore.getEvents(gameId);
    return JSON.stringify(events);
  },
  restore: async (events: string) => {
    const parsed = JSON.parse(events);
    parsed.events.forEach((event: MyEventTypeDetails) => {
      gameEventStore.pushEvent(event);
    });
  },
};
