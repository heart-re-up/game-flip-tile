var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/commands/FCommandFlipTile.ts
import { Command, tuple } from "@castore/core";

// src/core/GameEventStore.ts
import { EventStore } from "@castore/core";
import { InMemoryEventStorageAdapter } from "@castore/event-storage-adapter-in-memory";

// src/events/FlipTileEvent.ts
import { EventType } from "@castore/core";
var EVENT_TYPE = "FLIP_TILE";
var FlipTileEventType = new EventType({
  type: EVENT_TYPE
});

// src/events/InitGameEvent.ts
import { EventType as EventType2 } from "@castore/core";
var EVENT_TYPE2 = "INIT_GAME";
var InitGameEventType = new EventType2({
  type: EVENT_TYPE2
});

// src/events/index.ts
var myEventTypes = [InitGameEventType, FlipTileEventType];

// src/utils/tile-utils.ts
var createEmptyTiles = (tileCount, gameId) => {
  return Array.from({ length: tileCount }, (_, index) => {
    const tileId = `${gameId}-tile-${index}`;
    return {
      id: tileId,
      index,
      prize: null,
      flipped: false,
      flippedBy: null,
      flippedAt: null
    };
  });
};

// src/utils/board-util.ts
var computeDimensions = (tileCount, desiredSize, desiredOrientation) => {
  if (desiredSize) {
    if (desiredOrientation === "landscape") {
      return { width: desiredSize, height: Math.ceil(tileCount / desiredSize) };
    } else if (desiredOrientation === "portrait") {
      return { height: desiredSize, width: Math.ceil(tileCount / desiredSize) };
    }
  }
  const side = Math.sqrt(tileCount);
  const width = Math.ceil(side);
  const height = Math.ceil(tileCount / width);
  return { width, height };
};
var createBoard = (gameId, settings2) => {
  const { tileCount, desiredSize, desiredOrientation } = settings2;
  const { width, height } = computeDimensions(
    tileCount,
    desiredSize,
    desiredOrientation
  );
  const tiles = createEmptyTiles(tileCount, gameId);
  return {
    gameId,
    width,
    height,
    tiles
  };
};

// src/utils/prize-util.ts
import Rand, { PRNG } from "rand-seed";
function shuffle(array, seed) {
  const rand = new Rand(seed, PRNG.mulberry32);
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(rand.next() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
var distributePrizes = (gameId, tiles, prizeSettings2) => {
  const tilesCopy = [...tiles];
  const availableTileIndices = Array.from(
    { length: tilesCopy.length },
    (_, i) => i
  );
  const shuffledIndices = shuffle(availableTileIndices, gameId);
  let currentTileIndex = 0;
  for (const setting of prizeSettings2) {
    for (let i = 0; i < setting.quantity; i++) {
      if (currentTileIndex < shuffledIndices.length) {
        const tileIndex = shuffledIndices[currentTileIndex];
        tilesCopy[tileIndex] = __spreadProps(__spreadValues({}, tilesCopy[tileIndex]), {
          prize: __spreadValues({}, setting.prize)
        });
        currentTileIndex++;
      } else {
        console.warn(
          `\uC0C1\uD488 \uBC30\uCE58\uB97C \uC704\uD55C \uD0C0\uC77C\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4: ${setting.prize.name}`
        );
        break;
      }
    }
  }
  return tilesCopy;
};

// src/core/GameReducer.ts
var gameReducer = (aggregate, event) => {
  const { version } = event;
  switch (event.type) {
    case "INIT_GAME": {
      const { gameId, settings: settings2 } = event.payload;
      const board = createBoard(gameId, settings2.board);
      board.tiles = distributePrizes(gameId, board.tiles, settings2.prizes);
      return {
        aggregateId: gameId,
        version,
        gameId,
        board,
        initialized: true,
        completed: false,
        createdAt: event.timestamp,
        updatedAt: event.timestamp
      };
    }
    case "FLIP_TILE": {
      const { board } = aggregate;
      const { tileIndex, flippedBy } = event.payload;
      const tile = board == null ? void 0 : board.tiles[tileIndex];
      if (!tile) {
        throw new Error(`\uD0C0\uC77C[${tileIndex}]\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4`);
      }
      tile.flipped = true;
      tile.flippedBy = flippedBy;
      tile.flippedAt = event.timestamp;
      return __spreadProps(__spreadValues({}, aggregate), {
        version,
        updatedAt: event.timestamp
      });
    }
    default:
      return aggregate;
  }
};

// src/core/GameEventStore.ts
var createEventStore = () => new EventStore({
  eventStoreId: EVENT_STORE_ID,
  eventTypes: myEventTypes,
  eventStorageAdapter: new InMemoryEventStorageAdapter(),
  reducer: gameReducer,
  simulateSideEffect: (indexedEvents, event) => {
    console.log("simulateSideEffect", indexedEvents, event);
    return indexedEvents;
  }
});
var EVENT_STORE_ID = "FLIP_GAME";
var eventStore = createEventStore();

// src/core/GameMessageQueue.ts
import {
  AggregateExistsMessageQueue,
  NotificationMessageQueue,
  StateCarryingMessageQueue
} from "@castore/core";
import { InMemoryMessageQueueAdapter } from "@castore/message-queue-adapter-in-memory";
var defaultWorker = async (message) => {
  console.log(">>> defaultWorker: ", message);
};
var gameMessageQueue = null;
var initGameMessageQueue = (messageQueueId) => {
  switch (messageQueueId) {
    case "GAME_MESSAGE_QUEUE":
      gameMessageQueue = new NotificationMessageQueue({
        messageQueueId: "GAME_MESSAGE_QUEUE",
        sourceEventStores: [eventStore]
      });
      break;
    case "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE":
      gameMessageQueue = new AggregateExistsMessageQueue({
        messageQueueId: "GAME_AGGREGATE_EXISTS_MESSAGE_QUEUE",
        sourceEventStores: [eventStore]
      });
      break;
    case "GAME_STATE_CARRYING_MESSAGE_QUEUE":
      gameMessageQueue = new StateCarryingMessageQueue({
        messageQueueId: "GAME_STATE_CARRYING_MESSAGE_QUEUE",
        sourceEventStores: [eventStore]
      });
      break;
  }
  InMemoryMessageQueueAdapter.attachTo(gameMessageQueue, {
    worker: defaultWorker
  });
};
var getMessageQueue = () => {
  return gameMessageQueue;
};

// src/commands/FCommandFlipTile.ts
var CommandFlipTile = new Command({
  commandId: "FLIP_TILE",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple(eventStore),
  // 👇 Code to execute
  handler: async (input, [eventStore2]) => {
    var _a, _b;
    const { gameId, tileIndex, flippedBy } = input;
    const { aggregate } = await eventStore2.getAggregate(gameId);
    const version = (_a = aggregate == null ? void 0 : aggregate.version) != null ? _a : 0;
    const event = {
      aggregateId: gameId,
      version: version + 1,
      type: FlipTileEventType.type,
      payload: { tileIndex, flippedBy },
      metadata: {}
    };
    const nextAggregate = (_b = (await eventStore2.pushEvent(event)).nextAggregate) != null ? _b : (await eventStore2.getExistingAggregate(gameId)).aggregate;
    getMessageQueue().publishMessage({
      eventStoreId: EVENT_STORE_ID,
      event: __spreadProps(__spreadValues({}, event), { timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
      aggregate: nextAggregate
    });
    return nextAggregate;
  }
});

// src/commands/FCommandGetGame.ts
import { Command as Command2, tuple as tuple2 } from "@castore/core";
var CommandGetGame = new Command2({
  commandId: "GET_GAME",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple2(eventStore),
  // 👇 Code to execute
  handler: async (input, [eventStore2]) => {
    const { gameId } = input;
    const { aggregate: gameState } = await eventStore2.getAggregate(gameId);
    if (gameState === void 0) {
      throw new Error("Game not found");
    }
    return { gameState };
  }
});

// src/commands/FCommandInitGame.ts
import { Command as Command3, tuple as tuple3 } from "@castore/core";
var CommandInitGame = new Command3({
  commandId: "INIT_GAME",
  // 👇 "tuple" is needed to keep ordering in inferred type
  requiredEventStores: tuple3(eventStore),
  // 👇 Code to execute
  handler: async (input, [eventStore2]) => {
    var _a, _b;
    const { gameId, settings: settings2 } = input;
    const { aggregate } = await eventStore2.getAggregate(gameId);
    const version = (_a = aggregate == null ? void 0 : aggregate.version) != null ? _a : 0;
    const event = {
      aggregateId: gameId,
      version: version + 1,
      type: InitGameEventType.type,
      payload: { gameId, settings: settings2 },
      metadata: {}
    };
    const nextAggregate = (_b = (await eventStore2.pushEvent(event)).nextAggregate) != null ? _b : (await eventStore2.getExistingAggregate(gameId)).aggregate;
    getMessageQueue().publishMessage({
      eventStoreId: EVENT_STORE_ID,
      event: __spreadProps(__spreadValues({}, event), { timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
      aggregate: nextAggregate
    });
    return nextAggregate;
  }
});

// src/core/GameController.ts
initGameMessageQueue("GAME_STATE_CARRYING_MESSAGE_QUEUE");
var GameController = {
  initGame: async (gameId, settings2) => {
    const input = { gameId, settings: settings2 };
    return CommandInitGame.handler(input, [eventStore]);
  },
  getGame: async (gameId) => {
    const input = { gameId };
    return CommandGetGame.handler(input, [eventStore]);
  },
  flipTile: async (gameId, tileIndex, userId) => {
    const input = { gameId, tileIndex, flippedBy: userId };
    return CommandFlipTile.handler(input, [eventStore]);
  },
  save: async (gameId) => {
    const events = await eventStore.getEvents(gameId);
    return JSON.stringify(events);
  },
  restore: async (events) => {
    const parsed = JSON.parse(events);
    parsed.events.forEach((event) => {
      eventStore.pushEvent(event);
    });
  }
};

// __sample__/index.ts
var prize1 = { id: "1", name: "1\uB4F1 \uC0C1\uD488", value: 1e3 };
var prize2 = { id: "2", name: "2\uB4F1 \uC0C1\uD488", value: 500 };
var prize3 = { id: "3", name: "3\uB4F1 \uC0C1\uD488", value: 100 };
var prizeSettings = [
  {
    prize: prize1,
    quantity: 1
  },
  {
    prize: prize2,
    quantity: 3
  },
  {
    prize: prize3,
    quantity: 12
  }
];
var boardSettings = {
  tileCount: 100
};
var settings = {
  id: "this-is-settings-id",
  board: boardSettings,
  prizes: prizeSettings
};
var userIds = ["user1", "user2", "user3", "user4", "user5"];
async function simulateGame() {
  var _a, _b, _c, _d;
  const gameId = "this-is-game-id";
  const initialGameState = await GameController.initGame(gameId, settings);
  console.log("\uAC8C\uC784\uC774 \uCD08\uAE30\uD654 \uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
  const tileIndices = ((_a = initialGameState == null ? void 0 : initialGameState.board) == null ? void 0 : _a.tiles.map((tile) => tile.index)) || [];
  for (let i = 0; i < tileIndices.length; i++) {
    const userId = userIds[i % userIds.length];
    const tileIndex = tileIndices[i];
    console.log(`\uC0AC\uC6A9\uC790 ${userId}\uAC00 \uD0C0\uC77C ${tileIndex}\uB97C \uB4A4\uC9D1\uC2B5\uB2C8\uB2E4.`);
    try {
      const gameAggregate = await GameController.flipTile(
        gameId,
        tileIndex,
        userId
      );
      const foundTile = (_c = (_b = gameAggregate == null ? void 0 : gameAggregate.board) == null ? void 0 : _b.tiles) == null ? void 0 : _c.find(
        (tile) => tile.index === tileIndex
      );
      if (foundTile == null ? void 0 : foundTile.prize) {
        console.log(
          `FLIP RESULT: ${foundTile.prize.name}\uC744(\uB97C) \uBC1C\uACAC\uD588\uC2B5\uB2C8\uB2E4! \u{1F389}\u{1F389}\u{1F389}`
        );
      } else {
        console.log("FLIP RESULT: \uC544\uBB34\uAC83\uB3C4 \uBC1C\uACAC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4 \u{1F92F}");
      }
    } catch (error) {
      console.error(`\uD0C0\uC77C \uB4A4\uC9D1\uAE30 \uC624\uB958: ${error.message}`);
    }
  }
  const { gameState: finalGameState } = await GameController.getGame(gameId);
  console.log(
    "prize tiles",
    (_d = finalGameState.board) == null ? void 0 : _d.tiles.filter((tile) => tile.prize)
  );
  console.log("\uCD5C\uC885 \uAC8C\uC784 \uC0C1\uD0DC:", finalGameState);
  const events = await GameController.save(gameId);
  console.log("\uCD5C\uC885 \uAC8C\uC784 \uC774\uBCA4\uD2B8 \uB370\uC774\uD130", events);
}
console.log("\uAC8C\uC784\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4...");
simulateGame().catch((error) => {
  console.error("\uAC8C\uC784 \uC2E4\uD589 \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
});
