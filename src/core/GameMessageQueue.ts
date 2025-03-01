import {
  AggregateExistsMessageQueue,
  NotificationMessageQueue,
  StateCarryingMessageQueue,
  type AggregateExistsMessage,
  type Message,
  type NotificationMessage,
  type StateCarryingMessage,
} from "@castore/core";
import { InMemoryMessageQueueAdapter } from "@castore/message-queue-adapter-in-memory";
import type { MyEventTypeDetails } from "../events";
import type { GameAggregate } from "./GameAggregate";
import { EVENT_STORE_ID, eventStore } from "./GameEventStore";

type MESSAGE_QUEUE =
  | AggregateExistsMessageQueue
  | StateCarryingMessageQueue
  | NotificationMessageQueue;

const defaultWorker = async (message: Message) => {
  console.log(">>> defaultWorker: ", message);
};

let gameMessageQueue:
  | null
  | NotificationMessageQueue
  | AggregateExistsMessageQueue
  | StateCarryingMessageQueue = null;

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

export type GameMessageQueueType =
  | "GAME_MESSAGE_QUEUE"
  | "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE"
  | "GAME_STATE_CARRYING_MESSAGE_QUEUE";

export const initGameMessageQueue = (messageQueueId: GameMessageQueueType) => {
  switch (messageQueueId) {
    case "GAME_MESSAGE_QUEUE":
      gameMessageQueue = new NotificationMessageQueue({
        messageQueueId: "GAME_MESSAGE_QUEUE",
        sourceEventStores: [eventStore],
      });
      break;
    case "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE":
      gameMessageQueue = new AggregateExistsMessageQueue({
        messageQueueId: "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE",
        sourceEventStores: [eventStore],
      });
      break;
    case "GAME_STATE_CARRYING_MESSAGE_QUEUE":
      gameMessageQueue = new StateCarryingMessageQueue({
        messageQueueId: "GAME_STATE_CARRYING_MESSAGE_QUEUE",
        sourceEventStores: [eventStore],
      });
      break;
  }

  InMemoryMessageQueueAdapter.attachTo(gameMessageQueue, {
    worker: defaultWorker,
  });
};

export const getMessageQueue = (): MESSAGE_QUEUE => {
  return gameMessageQueue!;
};
