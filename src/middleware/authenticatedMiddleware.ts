import { createMiddleware } from "hono/factory";
import type { MyEnv } from "~/utils/types";

type Env = MyEnv & {
    Variables: {
        user: NonNullable<MyEnv['Variables']['user']>
        session: NonNullable<MyEnv['Variables']['session']>
    }
}

export const authenticatedMiddleware = createMiddleware<Env>(async (c, next) => {
    if (!c.var.session || !c.var.user) 
        return c.text("Unauthorized", 401)
    return next()
})