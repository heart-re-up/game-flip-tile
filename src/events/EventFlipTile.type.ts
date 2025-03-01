import type { BaseEventMetadata } from "./base.type";

export type EventFlipTilePayload = {
  tileIndex: number;
  flippedBy: string;
};

export type EventFlipTileMetadata = BaseEventMetadata & {};
