import { Hono } from "hono";
import { auth } from "~/utils/auth";

export const betterAuthRoutes = new Hono<{Bindings: Cloudflare.Env}>()

betterAuthRoutes.on(["POST", "GET"], "/", (c) => {
	return auth.handler(c.req.raw);
});