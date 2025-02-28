import { describe, expect, it } from "vitest";
import { computeDimensions } from "../../src/utils/board-util";

describe("math", () => {
  const testCount = [5, 7, 10, 31, 33, 80, 100, 101, 200, 300, 1000, 1001];

  it("should compute dimensions correctly", () => {
    const dimensions = computeDimensions(100);
    expect(dimensions).toEqual({ width: 10, height: 10 });
  });

  testCount.forEach((count) => {
    it(`should compute dimensions correctly with count ${count}`, () => {
      const dimensions = computeDimensions(count);
      console.log(dimensions);
      expect(dimensions.width * dimensions.height).toBeGreaterThanOrEqual(
        count,
      );
    });
  });

  it("should compute dimensions correctly with size", () => {
    const dimensions = computeDimensions(100, 10);
    expect(dimensions).toEqual({ width: 10, height: 10 });
  });

  it("should compute dimensions correctly with odd count", () => {
    const dimensions = computeDimensions(101);
    expect(dimensions).toEqual({ width: 11, height: 10 });
  });

  it("should compute dimensions correctly with horizontal orientation and odd size", () => {
    const dimensions = computeDimensions(101, 10, "landscape");
    expect(dimensions).toEqual({ width: 10, height: 11 });
  });

  it("should compute dimensions correctly with vertical orientation and odd size", () => {
    const dimensions = computeDimensions(101, 10, "portrait");
    expect(dimensions).toEqual({ width: 11, height: 10 });
  });
});
