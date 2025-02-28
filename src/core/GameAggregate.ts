import { type Aggregate } from "@castore/core";
import type { GameState } from "../types/GameInstance";

export type GameAggregate = Aggregate & GameState;
