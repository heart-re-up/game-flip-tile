import { EventType } from "@castore/core";
import type {
  EventFlipTileMetadata,
  EventFlipTilePayload,
} from "./EventFlipTile.type";

const EVENT_TYPE = "FLIP_TILE" as const;

export const EventFlipTileType = new EventType<
  typeof EVENT_TYPE,
  EventFlipTilePayload,
  EventFlipTileMetadata
>({
  type: EVENT_TYPE,
});
