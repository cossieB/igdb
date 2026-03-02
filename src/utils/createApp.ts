import { OpenAPIHono } from "@hono/zod-openapi";
import type { MyEnv } from "./types";

export function createApp() {
    return new OpenAPIHono<MyEnv>({
        strict: false
    })
}