import type { Settings } from "../types/settings";
import type { BaseEventMetadata } from "./base.type";

export type EventInitGamePayload = {
  settings: Settings;
};

export type EventInitGameMetadata = BaseEventMetadata & {};
