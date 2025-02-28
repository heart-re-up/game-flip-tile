import type { BoardOrientation } from "./orientation";
import type { Prize } from "./prize";

/**
 * 보드 설정
 *
 * 원하는 크기 및 방향이 존재하지 않을 때는 자동으로 계산됩니다.
 */
export type BoardSetting = {
  /** 타일 수 */
  tileCount: number;
  /** 원하는 크기 */
  desiredSize?: number;
  /** 원하는 방향 */
  desiredOrientation?: BoardOrientation;
};

/**
 * 상품 설정
 */
export type PrizeSetting = {
  /** 상품 */
  prize: Prize;
  /** 상품 수량 */
  quantity: number;
};

/**
 * 게임 설정
 *
 * 설정을 기반으로 새 게임을 생성할 수 있습니다.
 */
export type Settings = {
  /** 설정 아이디 */
  id: string;
  /** 보드 설정 */
  board: BoardSetting;
  /** 상품 설정 */
  prizes: PrizeSetting[];
};
