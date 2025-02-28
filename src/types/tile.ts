import type { Prize } from "./prize";

/**
 * 타일 인터페이스
 */
export interface Tile {
  /** 타일 아이디. 렌더에 사용될 수 있으므로 게임내에서 유니크해야 한다. */
  id: string;
  /** 타일 인덱스 */
  index: number;
  /** 타일에 부여된 상품 */
  prize: Prize | null;
  /** 타일 뒤집힘 여부 */
  flipped: boolean;
  /** 타일 뒤집은 사용자 ID */
  flippedBy?: string | null;
  /** 타일 뒤집은 시간 */
  flippedAt?: Date | null;
}
