import { randomUUID } from "crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { createRand, shuffle } from "../../src/utils/random";
describe("random", () => {
  let seed: string;
  beforeEach(() => {
    seed = randomUUID();
  });

  it("항상 동일한 랜덤 값을 반환해야 한다.", () => {
    const rand1 = createRand(seed);
    const rand2 = createRand(seed);
    const result1 = Array.from({ length: 100 }, () => rand1.next());
    const result2 = Array.from({ length: 100 }, () => rand2.next());
    expect(result1).toEqual(result2);
  });

  it("배열이 항상 동일하게 섞여야 한다.", () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);
    const shuffledArray = shuffle(array, seed);
    expect(shuffledArray).not.toEqual(array);
  });
});
