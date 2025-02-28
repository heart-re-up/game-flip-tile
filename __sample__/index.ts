import { game, gameService } from "../src/core/Game";
import { Prize } from "../src/types/prize";
import { BoardSetting, PrizeSetting, Settings } from "../src/types/settings";

// 상품 정의
const prize1: Prize = { id: "1", name: "1등 상품", value: 1000 };
const prize2: Prize = { id: "2", name: "2등 상품", value: 500 };
const prize3: Prize = { id: "3", name: "3등 상품", value: 100 };

const prizeSettings: PrizeSetting[] = [
  {
    prize: prize1,
    quantity: 1,
  },
  {
    prize: prize2,
    quantity: 3,
  },
  {
    prize: prize3,
    quantity: 12,
  },
];

const boardSettings: BoardSetting = {
  tileCount: 100,
};

const settings: Settings = {
  id: "this-is-settings-id",
  board: boardSettings,
  prizes: prizeSettings,
};

// 사용자 ID 예시 (실제로는 익명 사용자가 제공)
const userIds = ["user1", "user2", "user3", "user4", "user5"];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 타일 뒤집기 시뮬레이션
async function simulateGame() {
  const gameId = "this-is-game-id";

  const { gameState: initialGameState } = await game.init(gameId, settings);

  console.log("게임이 초기화 되었습니다.");

  // 각 타일의 ID 추출
  const tileIds = initialGameState?.board?.tiles.map((tile) => tile.id) || [];

  // 모든 타일을 무작위 순서로 뒤집기
  for (let i = 0; i < tileIds.length; i++) {
    const userId = userIds[i % userIds.length];
    const tileId = tileIds[i];

    console.log(`사용자 ${userId}가 타일 ${tileId}를 뒤집습니다.`);
    try {
      const { tile: flippedTile } = await game.flipTile(gameId, tileId, userId);
      if (flippedTile?.prize) {
        console.log(
          `FLIP RESULT: ${flippedTile.prize.name}을(를) 발견했습니다! 🎉🎉🎉`,
        );
      } else {
        console.log("FLIP RESULT: 아무것도 발견하지 못했습니다 🤯");
      }
    } catch (error) {
      console.error(`타일 뒤집기 오류: ${error.message}`);
    }
  }

  // 게임 상태 확인
  const { gameState: finalGameState } = await game.getGame(gameId);
  console.log("최종 게임 상태:", finalGameState);

  const events = await gameService.save(gameId);
  console.log("최종 게임 이벤트 데이터", events);
}

// 게임 시작
console.log("게임을 시작합니다...");
simulateGame().catch((error) => {
  console.error("게임 실행 중 오류 발생:", error);
});

// // 게임 데이터 저장 예시
// setTimeout(
//   () => {
//     const savedData = gameService.exportGameData();
//     console.log("게임 데이터가 저장되었습니다.");
//     console.log(JSON.stringify(savedData, null, 2).substring(0, 200) + "...");

//     // 저장된 데이터로 새 게임 불러오기
//     console.log("저장된 게임을 불러옵니다...");
//     const newGameService = new GameService();
//     newGameService.loadGame(savedData);
//     console.log("게임이 성공적으로 불러와졌습니다.");
//   },
//   (gameService.getState().board.tileCount + 1) * 500,
// );
