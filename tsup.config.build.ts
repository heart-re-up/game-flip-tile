import { defineConfig } from "tsup";

// 기본 설정 (src 디렉토리만 빌드)
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // support formats
  dts: true, // generate type declaration files
  splitting: true, // enable code splitting (esm)
  clean: true, // clean build directory before building
  tsconfig: "tsconfig.build.json", // use build-specific tsconfig
  outDir: "dist",
});

// 샘플 설정은 별도 파일로 분리
// tsup.sample.config.ts 파일로 분리하여 사용
