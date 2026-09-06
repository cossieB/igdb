import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    dbCredentials: {
        url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/30f7ce312b6e1bdcaa575d712107fa258ab04e2705e2c2d08962e3cf824c94e5.sqlite"
    },
    schema: './src/drizzle/schema/*.ts',
    out: "src/drizzle/migrations"
})