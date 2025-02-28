import type { EventTypeDetails } from "@castore/core";
import { FlipTileEventType } from "./FlipTileEvent";
import { InitGameEventType } from "./InitGameEvent";

export const myEventTypes = [InitGameEventType, FlipTileEventType];
export type MyEventTypeDetails = EventTypeDetails<typeof myEventTypes>;
