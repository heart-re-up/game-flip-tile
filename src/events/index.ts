import type { EventTypeDetails } from "@castore/core";
import { DistributePrizesEventType } from "./EventDistibutePrizes";
import { EventFlipTileType } from "./EventFlipTile";
import { EventInitGameType } from "./EventInitGame";

export const myEventTypes = [
  EventInitGameType,
  DistributePrizesEventType,
  EventFlipTileType,
];

// 모든 이벤트에 대한 타입 상세
export type MyEventTypeDetails = EventTypeDetails<typeof myEventTypes>;
