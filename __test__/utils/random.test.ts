import { randomUUID } from "crypto";
import Rand, { PRNG } from "rand-seed";
import { beforeEach, describe, expect, it } from "vitest";
import { shuffle } from "../../src/utils/random.util";
describe("random", () => {
  let seed: string;
  beforeEach(() => {
    seed = randomUUID();
  });

  it("항상 동일한 랜덤 값을 반환해야 한다.", () => {
    const start = performance.now();
    const rand1 = new Rand(seed, PRNG.mulberry32);
    const rand2 = new Rand(seed, PRNG.mulberry32);
    const result1 = Array.from({ length: 1_000_000 }, () => rand1.next());
    const result2 = Array.from({ length: 1_000_000 }, () => rand2.next());
    expect(result1).toEqual(result2);
    const end = performance.now();
    console.log(`time: ${end - start}ms`);
  });

  it("배열이 항상 동일하게 섞여야 한다.", () => {
    const start = performance.now();
    const array = Array.from({ length: 1_000_000 }, (_, i) => i);
    const shuffledArray1 = shuffle(array, new Rand(seed, PRNG.mulberry32));
    const shuffledArray2 = shuffle(array, new Rand(seed, PRNG.mulberry32));
    expect(shuffledArray1).toEqual(shuffledArray2);
    const end = performance.now();
    console.log(`time: ${end - start}ms`);
  });
});
