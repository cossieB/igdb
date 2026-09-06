import { defineWorkersConfig, readD1Migrations } from "@cloudflare/vitest-pool-workers/config";
import path from "node:path";

export default defineWorkersConfig(async () => {
    const migrationsPath = path.join(__dirname, "src", "drizzle", "migrations")
    const migrations = await readD1Migrations(migrationsPath);

    return {
        test: {
            poolOptions: {
                workers: {
                    wrangler: { configPath: "./wrangler.jsonc" },
                    miniflare: {
                        d1Databases: ['DB'],
                        bindings: { TEST_MIGRATIONS: migrations }
                    }
                },
            },
            env: {
                NODE_ENV: "test"
            },
            alias: {
                "~/": new URL('./src/', import.meta.url).pathname
            },
            setupFiles: ["./src/__tests__/setup.ts"]
        },
    }
});