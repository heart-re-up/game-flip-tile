/**
 * 상품 인터페이스
 */
export interface Prize {
  /** 상품 아이디 */
  id: string;
  /** 상품 이름 */
  name: string;
  /** 상품 가치 */
  value?: number;
}
