import Rand, { PRNG } from "rand-seed";
import type { PrizeSetting } from "../types/settings";
import type { Tile } from "../types/tile";

/**
 * 배열 섞기
 */
export function shuffle<T>(array: T[], seed: string): T[] {
  const rand = new Rand(seed, PRNG.mulberry32);
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(rand.next() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const distributePrizes = (
  gameId: string,
  tiles: Tile[],
  prizeSettings: PrizeSetting[],
): Tile[] => {
  const tilesCopy = [...tiles];
  const availableTileIndices = Array.from(
    { length: tilesCopy.length },
    (_, i) => i,
  );

  // 시드 기반으로 타일 인덱스 섞기
  const shuffledIndices = shuffle(availableTileIndices, gameId);

  let currentTileIndex = 0;

  // 각 상품을 quantity만큼 타일에 배치
  for (const setting of prizeSettings) {
    for (let i = 0; i < setting.quantity; i++) {
      if (currentTileIndex < shuffledIndices.length) {
        const tileIndex = shuffledIndices[currentTileIndex];
        tilesCopy[tileIndex] = {
          ...tilesCopy[tileIndex],
          prize: { ...setting.prize },
        };
        currentTileIndex++;
      } else {
        console.warn(
          `상품 배치를 위한 타일이 부족합니다: ${setting.prize.name}`,
        );
        break;
      }
    }
  }

  return tilesCopy;
};

/**
 * 상품 타일 수집
 */
export const collectPrizeTiles = (tiles: Tile[], prize: PrizeSetting) => {
  return tiles.filter((tile) => tile.prize?.id === prize.prize.id);
};

/**
 * 남은 상품 타일 수 계산
 */
export const computeRemaingPrize = (tiles: Tile[], prize: PrizeSetting) => {
  return prize.quantity - collectPrizeTiles(tiles, prize).length;
};
