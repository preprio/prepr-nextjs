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
            onSuccess: "NODE_ENV=production postcss ./src/globals.css -o ./dist/index.css",
            clean: true,
            external: ['react', 'react-dom', 'next/navigation'],
            metafile: !options.watch,
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
            metafile: !options.watch,
            treeshake: true,
        },
    ] as Options[];
});
