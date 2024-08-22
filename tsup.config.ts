import { defineConfig } from "tsup";
import path from "path";

export default defineConfig([
    {
        entry: ["src/index.ts", "src/components.tsx", "src/components.css"],
        clean: true,
        dts: true,
        sourcemap: true,
        tsconfig: path.resolve(__dirname, "./tsconfig.build.json"),
        format: ["cjs", "esm"],
        outDir: "dist",
    },
]);