import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json"

//NEW
import terser from "@rollup/plugin-terser";
import run from "@rollup/plugin-run";
import sourcemaps from "rollup-plugin-sourcemaps"

import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
    {
        input: "./framework/main.ts",
        output: [
            {
                dir: "dist/cjs/",
                format: "cjs",
                sourcemap: true,
            },
        ],
        plugins: [
            // NEW
            peerDepsExternal(),

            json(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),

            // NEW
            terser(),

            run({
                execArgv: ['--enable-source-maps']
            }),
            sourcemaps()
        ],
    },
];
