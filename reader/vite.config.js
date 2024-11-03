import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import postcssGapProperties from "postcss-gap-properties";
import postcssPresetEnv from "postcss-preset-env";

export default defineConfig({
  base: "./",

  build: {
    outDir: "dist",
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 0,
          features: {
            "gap-properties": true,
          },
          browsers: "last 2 versions, > 1%, Safari >= 11",
        }),
        postcssGapProperties(),
      ],
    },
  },
  plugins: [
    babel({
      babelConfig: {
        presets: ["@babel/preset-react"],
        plugins: ["@babel/plugin-transform-react-jsx"],
      },
      extensions: [".js", ".jsx"],
    }),
  ],
});
