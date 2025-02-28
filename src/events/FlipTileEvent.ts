import type { EventTypeDetail } from "@castore/core";
import { EventType } from "@castore/core";

const EVENT_TYPE = "FLIP_TILE" as const;

export const FlipTileEventType = new EventType<
  // Event Type
  typeof EVENT_TYPE,
  // Payload
  {
    tileId: string;
    flippedBy: string;
  },
  // Metadata
  {}
>({
  type: EVENT_TYPE,
});

export type FlipTileEventDetail = EventTypeDetail<typeof FlipTileEventType>;
