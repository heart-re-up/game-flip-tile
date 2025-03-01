import {
  AggregateExistsMessageQueue,
  NotificationMessageQueue,
  StateCarryingMessageQueue,
  type AggregateExistsMessage,
  type NotificationMessage,
  type StateCarryingMessage,
} from "@castore/core";
import { InMemoryMessageQueueAdapter } from "@castore/message-queue-adapter-in-memory";
import type { MyEventTypeDetails } from "../events";
import type { GameAggregate } from "./GameAggregate";
import { EVENT_STORE_ID, eventStore } from "./GameEventStore";

export type GameAggregateExistsMessage = AggregateExistsMessage<
  typeof EVENT_STORE_ID
>;

export type GameEventNotificationMessage = NotificationMessage<
  typeof EVENT_STORE_ID,
  MyEventTypeDetails
>;

export type GameStateCarryingMessage = StateCarryingMessage<
  typeof EVENT_STORE_ID,
  MyEventTypeDetails,
  GameAggregate
>;

export const gameMessageQueue = new NotificationMessageQueue({
  messageQueueId: "GAME_MESSAGE_QUEUE",
  sourceEventStores: [eventStore],
});

export const gameAggregateExistsMessageQueue = new AggregateExistsMessageQueue({
  messageQueueId: "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE",
  sourceEventStores: [eventStore],
});

export const gameStateCarryingMessageQueue = new StateCarryingMessageQueue({
  messageQueueId: "GAME_STATE_CARRYING_MESSAGE_QUEUE",
  sourceEventStores: [eventStore],
});

InMemoryMessageQueueAdapter.attachTo(gameMessageQueue, {
  worker: async (message) => {
    console.log(">>> bus: ", message);
  },
});

// const listeners:Set<> =
