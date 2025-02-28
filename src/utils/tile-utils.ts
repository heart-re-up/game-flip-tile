import type { Tile } from "../types/tile";

/**
 * 빈 타일 배열 생성
 * @param tileCount 생성할 타일 수
 * @param gameId 타일 ID 생성에 사용할 게임 ID (시드)
 */
export const createEmptyTiles = (
  tileCount: number,
  gameId?: string,
): Tile[] => {
  return Array.from({ length: tileCount }, (_, index) => {
    // 게임 ID와 인덱스를 조합하여 결정적인 타일 ID 생성
    const tileId = `${gameId}-tile-${index}`;
    return {
      id: tileId,
      index,
      prize: null,
      flipped: false,
      flippedBy: null,
      flippedAt: null,
    };
  });
};

/**
 * 타일 뒤집기
 */
export const flipTile = (tile: Tile, userId: string): void => {
  tile.flipped = true;
  tile.flippedBy = userId;
  tile.flippedAt = new Date();
};

/**
 * 뒤집힌 타일 수 계산
 */
export const computeFlippedTiles = (tiles: Tile[]) => {
  return tiles.filter((tile) => tile.flipped).length;
};

/**
 * 남은 타일 수 계산
 */
export const computeRemainingTiles = (tiles: Tile[]) => {
  return tiles.length - computeFlippedTiles(tiles);
};
