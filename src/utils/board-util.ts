import type { Board } from "../types/game";
import type { BoardOrientation } from "../types/orientation";
import type { BoardSetting } from "../types/settings";
import { createEmptyTiles } from "./tile-utils";

/**
 * 보드 차원 계산
 */
export const computeDimensions = (
  tileCount: number,
  desiredSize?: number,
  desiredOrientation?: BoardOrientation,
): { width: number; height: number } => {
  if (desiredSize) {
    if (desiredOrientation === "landscape") {
      // 가로 방향: 너비를 desiredSize로 고정
      return { width: desiredSize, height: Math.ceil(tileCount / desiredSize) };
    } else if (desiredOrientation === "portrait") {
      // 세로 방향: 높이를 desiredSize로 고정
      return { height: desiredSize, width: Math.ceil(tileCount / desiredSize) };
    }
  }

  // 기본: 최대한 정사각형에 가깝게 배치
  const side = Math.sqrt(tileCount);
  const width = Math.ceil(side);
  const height = Math.ceil(tileCount / width);
  return { width, height };
};

/**
 * 주어진 너비와 높이에 대한 배열 인덱스로부터 그리드 좌표 계산
 */
export const indexToCoordinates = (
  index: number,
  width: number,
): { x: number; y: number } => {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
};

/**
 * 주어진 그리드 좌표로부터 배열 인덱스 계산
 */
export const coordinatesToIndex = (
  x: number,
  y: number,
  width: number,
): number => {
  return y * width + x;
};

/**
 * 게임 보드 생성
 */
export const createBoard = (gameId: string, settings: BoardSetting): Board => {
  const { tileCount, desiredSize, desiredOrientation } = settings;
  const { width, height } = computeDimensions(
    tileCount,
    desiredSize,
    desiredOrientation,
  );
  // 게임 ID를 시드로 사용하여 결정적인 타일 ID 생성
  const tiles = createEmptyTiles(tileCount, gameId);
  return {
    gameId,
    width,
    height,
    tiles,
  };
};
