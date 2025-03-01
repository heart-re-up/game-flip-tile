import type { PrizeSetting } from "../types/settings";
import type { BaseEventMetadata } from "./base.type";

export type EventDistributePrizesPayload = {
  prizeSettings: PrizeSetting;
};

export type EventDistributePrizesMetadata = BaseEventMetadata & {};
