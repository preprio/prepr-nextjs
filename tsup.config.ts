import { defineConfig, Options } from "tsup";

export default defineConfig((options) => {
    return [
        {
            entry: {
                "react/index": "src/react/index.tsx",
            },
            format: ["esm", "cjs"],
            dts: true,
            minify: !options.watch,
            sourcemap: true,
            esbuildOptions(options) {
                options.banner = {
                    js: '"use client";',
                };
            },
            onSuccess: "pnpm run build:css",
            clean: true,
            external: ['react', 'react-dom', 'next/navigation'],
            // Bundle analysis
            metafile: !options.watch,
  
            // Splitting for better caching
            splitting: false,
        },
        {
            entry: {
                "middleware/index": "src/middleware/index.ts",
                "server/index": "src/server/index.ts",
                "types/index": "src/types/index.ts",
                "utils/index": "src/utils/index.ts",
            },
            format: ["esm", "cjs"],
            dts: true,
            minify: !options.watch,
            sourcemap: true,
            external: ['react', 'react-dom'],
            // Bundle analysis
            metafile: !options.watch,
            // Tree shaking
            treeshake: true,
        },
    ] as Options[];
});
