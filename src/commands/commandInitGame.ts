import { Command, tuple } from "@castore/core";
import type { GameAggregate } from "../core/GameAggregate";
import { EVENT_STORE_ID, eventStore } from "../core/GameEventStore";
import { getMessageQueue } from "../core/GameMessageQueue";
import { EventInitGameType } from "../events/EventInitGame";
import type {
  EventInitGameMetadata,
  EventInitGamePayload,
} from "../events/EventInitGame.type";

type Output = GameAggregate;

export const CommandInitGame = new Command({
  commandId: EventInitGameType.type,
  requiredEventStores: tuple(eventStore),
  handler: async (
    input: EventInitGamePayload,
    [eventStore],
    context: EventInitGameMetadata,
  ): Promise<Output> => {
    const { aggregateId } = context;
    const { aggregate } = await eventStore.getAggregate(aggregateId);
    const version = aggregate?.version ?? 0;
    const event = {
      aggregateId,
      version: version + 1,
      type: EventInitGameType.type,
      payload: input,
      metadata: context,
    };
    const nextAggregate =
      (await eventStore.pushEvent(event)).nextAggregate ??
      (await eventStore.getExistingAggregate(aggregateId)).aggregate;
    getMessageQueue().publishMessage({
      eventStoreId: EVENT_STORE_ID,
      event: { ...event, timestamp: new Date().toISOString() },
      aggregate: nextAggregate,
    });
    return nextAggregate;
  },
});
