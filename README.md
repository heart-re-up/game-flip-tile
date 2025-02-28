# Game Flip Tile (게임 타일 뒤집기)

타일을 뒤집어 상품을 찾는 게임 모듈입니다. 이 모듈은 다양한 환경에서 재사용 가능하며, 서버와 클라이언트 간의 상태 동기화를 위한 리듀서 패턴을 지원합니다.

## 주요 기능

- 자동으로 계산되는 보드 크기 (너비 \* 높이)
- 익명 사용자 ID 기록
- 상품 배치 및 발견 시스템
- 게임 로그 기록
- 게임 상태 저장 및 불러오기
- 리듀서 패턴을 통한 상태 관리

## 설치

```bash
npm install game-flip-tile
# 또는
yarn add game-flip-tile
# 또는
pnpm add game-flip-tile
```

## 사용법

### 기본 사용법

```typescript
import { GameService, Prize } from "game-flip-tile";

// 상품 정의
const prizes: Prize[] = [
  { id: 1, name: "1등 상품", value: 1000, quantity: 1 },
  { id: 2, name: "2등 상품", value: 500, quantity: 3 },
  { id: 3, name: "3등 상품", value: 100, quantity: 5 },
];

// 게임 서비스 생성
const gameService = new GameService();

// 게임 보드 생성 (10x10 = 100 타일)
gameService.createBoard({
  tileCount: 100,
  prizes,
});

// 타일 뒤집기 (익명 사용자 ID 제공)
gameService.flipTile(42, "anonymous_user_123");

// 게임 완료 여부 확인
const isComplete = gameService.isGameComplete();

// 발견된 상품 확인
const revealedPrizes = gameService.getRevealedPrizes();
```

### 게임 상태 저장 및 불러오기

```typescript
// 게임 상태 저장
const savedData = gameService.exportGameData();
localStorage.setItem("savedGame", JSON.stringify(savedData));

// 게임 상태 불러오기
const loadedData = JSON.parse(localStorage.getItem("savedGame") || "{}");
gameService.loadGame(loadedData);
```

### 게임 상태 변경 구독

```typescript
// 게임 상태 변경 구독
const unsubscribe = gameService.subscribe((state) => {
  console.log("게임 상태가 변경되었습니다.");

  if (state.isComplete) {
    console.log("게임이 완료되었습니다!");
  }
});

// 구독 해제
unsubscribe();
```

### 커스텀 보드 크기 지정

```typescript
// 너비 지정 (높이는 자동 계산)
gameService.createBoard({
  tileCount: 100,
  width: 20, // 20x5 보드
  prizes,
});

// 높이 지정 (너비는 자동 계산)
gameService.createBoard({
  tileCount: 100,
  height: 10, // 10x10 보드
  prizes,
});
```

## API 참조

### 타입

#### `Tile`

타일 정보를 나타내는 인터페이스입니다.

```typescript
interface Tile {
  id: number;
  isFlipped: boolean;
  prize: Prize | null;
  flippedBy?: string | null; // 어떤 사용자가 뒤집었는지 (ID만 저장)
  flippedAt?: Date | null; // 언제 뒤집었는지
}
```

#### `Prize`

상품 정보를 나타내는 인터페이스입니다.

```typescript
interface Prize {
  id: number;
  name: string;
  value: number;
  quantity: number; // 이 상품이 몇 개의 타일에 배치될지
}
```

#### `GameBoard`

게임 보드 정보를 나타내는 인터페이스입니다.

```typescript
interface GameBoard {
  id: string;
  tiles: Tile[];
  width: number;
  height: number;
  tileCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `GameState`

게임 상태 정보를 나타내는 인터페이스입니다.

```typescript
interface GameState {
  board: GameBoard;
  logs: GameLog[];
  isComplete: boolean;
  prizes: Prize[];
  settings: GameSettings;
}
```

### 클래스

#### `GameService`

게임 상태를 관리하고 게임 로직을 캡슐화하는 서비스 클래스입니다.

```typescript
class GameService {
  constructor(initialState?: GameState);

  // 상태 관리
  getState(): GameState;
  dispatch(action: GameAction): void;
  subscribe(listener: (state: GameState) => void): () => void;

  // 게임 조작
  createBoard(settings: GameSettings): void;
  flipTile(tileId: number, playerId: string): void;
  restartGame(settings?: GameSettings): void;
  loadGame(savedData: SaveableGameData): void;

  // 게임 정보
  isGameComplete(): boolean;
  getRevealedPrizes(): Prize[];
  exportGameData(): SaveableGameData;
}
```

## 개발

### 설치

```bash
git clone https://github.com/your-username/game-flip-tile.git
cd game-flip-tile
pnpm install
```

### 스크립트

- `pnpm dev`: 개발 모드로 실행
- `pnpm build`: 패키지 빌드
- `pnpm test`: 테스트 실행
- `pnpm lint`: 린트 검사
- `pnpm format`: 코드 포맷팅

## 라이센스

MIT
