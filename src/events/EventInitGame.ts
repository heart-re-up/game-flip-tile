import { EventType } from "@castore/core";
import type {
  EventInitGameMetadata,
  EventInitGamePayload,
} from "./EventInitGame.type";

export const EVENT_TYPE = "INIT_GAME" as const;

export const EventInitGameType = new EventType<
  typeof EVENT_TYPE,
  EventInitGamePayload,
  EventInitGameMetadata
>({
  type: EVENT_TYPE,
});
