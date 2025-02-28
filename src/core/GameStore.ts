import { EventStore } from "@castore/core";
import { InMemoryEventStorageAdapter } from "@castore/event-storage-adapter-in-memory";
import { myEventTypes } from "../events";
import { gameReducer } from "./GameReducer";

const eventStorageAdapter = new InMemoryEventStorageAdapter();

export const gameEventStore = new EventStore({
  eventStoreId: "GAME",
  eventTypes: myEventTypes,
  eventStorageAdapter,
  reducer: gameReducer,
  // aggregateCache: {
  //   maxSize: 100,
  //   ttl: 60 * 1000, // 1분
  // },
});
