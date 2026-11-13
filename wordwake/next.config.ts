import type { NextConfig } from 'next';
// Use the compiler API supplied by the pinned TypeScript 5.9 toolchain.
const config: NextConfig = { experimental: { cpus: 1, useTypeScriptCli: false } };
export default config;
