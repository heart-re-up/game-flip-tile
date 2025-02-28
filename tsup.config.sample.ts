import { defineConfig } from "tsup";

// 샘플 빌드 설정
export default defineConfig({
  entry: ["__sample__/index.ts"],
  format: ["esm"], // 샘플은 ESM 형식만 지원
  dts: false, // 샘플은 타입 선언 파일 불필요
  splitting: false, // 샘플은 코드 분할 불필요
  clean: true, // 빌드 전 출력 디렉토리 정리
  tsconfig: "tsconfig.sample.json", // 샘플용 tsconfig 사용
  outDir: "dist-sample", // 별도의 출력 디렉토리 사용
});
