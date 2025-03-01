import { EventType } from "@castore/core";
import type {
  EventDistributePrizesMetadata,
  EventDistributePrizesPayload,
} from "./EventDistibutePrizes.type";

const EVENT_TYPE = "DISTRIBUTE_PRIZES" as const;

export const DistributePrizesEventType = new EventType<
  typeof EVENT_TYPE,
  EventDistributePrizesPayload,
  EventDistributePrizesMetadata
>({
  type: EVENT_TYPE,
});
