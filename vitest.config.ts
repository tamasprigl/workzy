import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.ts"],

    /**
     * `airtable` is inlined so its INTERNAL `require("./run_action")` resolves
     * through vitest's module graph and can be mocked.
     *
     * Without this, node_modules is externalised: the SDK loads the real HTTP
     * function, and the read-path tests reach api.airtable.com for real. They
     * were rejected with 401 rather than writing anything, but a test suite
     * that can reach a production API is one that will eventually write to it.
     * Inlining makes that impossible rather than unlikely.
     */
    server: {
      deps: {
        inline: ["airtable"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
