import { createMiddleware } from "hono/factory";
import { auth } from "~/utils/auth";
import type { MyEnv } from "~/utils/types";

export const setSession = createMiddleware<MyEnv>(async (c, next) => {
    const res = await auth.api.getSession({ 
		headers: c.req.raw.headers,
		returnHeaders: true
	});
    if (!res.response) {
    	c.set("user", null);
    	c.set("session", null);
    	return next();        
    } 
	c.header("Set-Cookie", res.headers.get("set-cookie") ?? undefined)
  	c.set("user", res.response.user);
  	c.set("session", res.response.session);
  	return next();    
})