import type { EventTypeDetail } from "@castore/core";
import { EventType } from "@castore/core";
import type { Settings } from "../types/settings";

const EVENT_TYPE = "INIT_GAME" as const;

export const InitGameEventType = new EventType<
  // Event Type
  typeof EVENT_TYPE,
  // Payload
  {
    gameId: string;
    settings: Settings;
  },
  // Metadata
  {}
>({
  type: EVENT_TYPE,
});

export type InitGameEventDetail = EventTypeDetail<typeof InitGameEventType>;
