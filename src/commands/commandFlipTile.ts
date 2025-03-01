import { Command, tuple } from "@castore/core";
import type { GameAggregate } from "../core/GameAggregate";
import { EVENT_STORE_ID, eventStore } from "../core/GameEventStore";
import { getMessageQueue } from "../core/GameMessageQueue";
import { EventFlipTileType } from "../events/EventFlipTile";
import type {
  EventFlipTileMetadata,
  EventFlipTilePayload,
} from "../events/EventFlipTile.type";

type Output = GameAggregate;

export const CommandFlipTile = new Command({
  commandId: EventFlipTileType.type,
  requiredEventStores: tuple(eventStore),
  handler: async (
    input: EventFlipTilePayload,
    [eventStore],
    context: EventFlipTileMetadata,
  ): Promise<Output> => {
    const { aggregateId } = context;
    const { aggregate } = await eventStore.getAggregate(aggregateId);
    const version = aggregate?.version ?? 0;
    const event = {
      aggregateId,
      version: version + 1,
      type: EventFlipTileType.type,
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
