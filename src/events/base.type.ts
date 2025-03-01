import type Rand from "rand-seed";

/**
 * 모든 이벤트에 공통으로 포함되는 메타데이터
 */
export type BaseEventMetadata = {
  /**
   * 결정 객체 아이디
   */
  aggregateId: string;

  /**
   * 랜덤 생성기
   *
   * 시드를 이용해서 결정적 랜덤 값을 생성합니다.
   */
  random: Rand;
};
