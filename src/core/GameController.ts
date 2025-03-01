import Rand, { PRNG } from "rand-seed";
import { CommandFlipTile } from "../commands/CommandFlipTile";
import { CommandGetGame } from "../commands/CommandGetGame";
import { CommandInitGame } from "../commands/CommandInitGame";
import type { MyEventTypeDetails } from "../events";
import type { PrizeSetting, Settings } from "../types/settings";
import { eventStore } from "./GameEventStore";
import { initGameMessageQueue } from "./GameMessageQueue";
import { CommandDistributePrizes } from "../commands/CommandDistributePrizes";
import type { BaseEventMetadata } from "../events/base.type";

initGameMessageQueue("GAME_STATE_CARRYING_MESSAGE_QUEUE");

/**
 * 게임 컨트롤러
 * 이벤트 소싱 기반의 게임 컨트롤러입니다.
 *
 * 지정된 aggregate 에 대한 모든 명령을 처리합니다.
 *
 */
class GameControllera {
  private readonly baseInput: unknown;
  private readonly baseMeta: BaseEventMetadata;

  constructor(gameId: string) {
    this.baseInput = { /* implement if needed. */};
    this.baseMeta = { aggregateId: gameId, random: new Rand(gameId, PRNG.mulberry32) };
  }
  /**
   * 게임 초기화
   * 게임 설정으로 게임을 초기화합니다.
   * 게임 초기화는 게임 생성 후 최초 한번만 실행됩니다.
   * 게임 초기화 후 게임 상태를 조회하면 초기화된 게임 상태를 조회할 수 있습니다.
   *
   * @param settings 게임 설정
   * @returns 게임 상태
   */
  initialize = async (settings: Settings) =>{
    const input = {  settings };
    const meta = { ...this.baseMeta };
    return CommandInitGame.handler(input, [eventStore], meta);
  }

  /**
   * @param prizeSettings
   */
  distributePrizes = async (prizeSettings: PrizeSetting) => {
    const input = { ...this.baseInput, prizeSettings };
    const meta = { ...this.baseMeta };
    return CommandDistributePrizes.handler(input, [eventStore], meta);
  };

  /**
   * 타일 뒤집기
   * 타일을 뒤집습니다.
   * 
   * @param gameId 게임 아이디
   * @param tileIndex 타일 인덱스
   * @param userId 사용자 아이디
   */
  flipTile= async (gameId: string, tileIndex: number, userId: string) => {
    const input = { gameId, tileIndex, flippedBy: userId };
    return CommandFlipTile.handler(input, [eventStore]);
  },

  save= async (gameId: string) => {
    const events = await eventStore.getEvents(gameId);
    return JSON.stringify(events);
  },

  restore= async (events: string) => {
    const parsed = JSON.parse(events);
    parsed.events.forEach((event: MyEventTypeDetails) => {
      eventStore.pushEvent(event);
    });
  },
}
