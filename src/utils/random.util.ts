import Rand from "rand-seed";

/**
 * 배열 섞기
 */
export function shuffle<T>(array: T[], rand: Rand): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(rand.next() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
