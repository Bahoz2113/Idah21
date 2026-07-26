import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  webServer: {
    command: "pnpm start",
    port: 3010,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: "http://localhost:3010",
    launchOptions: {
      executablePath: "/opt/pw-browsers/chromium",
    },
  },
});
