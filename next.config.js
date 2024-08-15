/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const execSync = require('child_process').execSync;
const latestGitCommit = 'git rev-parse HEAD';
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  generateBuildId: async () => {
    return execSync(latestGitCommit).toString().trim();
  },
};

export default config;
