import { EventStore } from "@castore/core";
import { InMemoryEventStorageAdapter } from "@castore/event-storage-adapter-in-memory";
import { myEventTypes } from "../events";
import { gameReducer } from "./GameReducer";

const createEventStore = () =>
  new EventStore({
    eventStoreId: EVENT_STORE_ID,
    eventTypes: myEventTypes,
    reducer: gameReducer,
    simulateSideEffect: (indexedEvents, event) => {
      console.log("simulateSideEffect", indexedEvents, event);
      return indexedEvents;
    },
    eventStorageAdapter: new InMemoryEventStorageAdapter(),
  });
export const EVENT_STORE_ID = "FLIP_GAME" as const;
export const eventStore = createEventStore();
