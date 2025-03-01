import { Command, tuple } from "@castore/core";
import type { GameAggregate } from "../core/GameAggregate";
import { EVENT_STORE_ID, eventStore } from "../core/GameEventStore";
import { getMessageQueue } from "../core/GameMessageQueue";
import {
  DistributePrizesEventType,
  type DistributePrizesEventDetail,
} from "../events/EventDistibutePrizes";
import type Rand from "rand-seed";

type Input = DistributePrizesEventDetail["payload"] & { gameId: string };
type Output = GameAggregate | undefined;

export const CommandDistributePrizes = new Command({
  commandId: "DISTRIBUTE_PRIZES",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(eventStore),
  // 👇 Code to execute
  handler: async (
    input: Input,
    [eventStore],
    context: { random: Rand },
  ): Promise<Output> => {
    const { gameId, prizeSettings } = input;
    const { aggregate } = await eventStore.getAggregate(gameId);
    const version = aggregate?.version ?? 0;
    const event = {
      aggregateId: gameId,
      version: version + 1,
      type: DistributePrizesEventType.type,
      payload: { prizeSettings },
      metadata: {},
    };
    const nextAggregate =
      (await eventStore.pushEvent(event)).nextAggregate ??
      (await eventStore.getExistingAggregate(gameId)).aggregate;
    getMessageQueue().publishMessage({
      eventStoreId: EVENT_STORE_ID,
      event: { ...event, timestamp: new Date().toISOString() },
      aggregate: nextAggregate,
    });
    return nextAggregate;
  },
});
