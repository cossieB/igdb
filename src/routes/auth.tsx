import { Hono } from "hono";
import { Layout } from "~/ui/Layout";
import { SignInWithGoogle } from "~/ui/SignInWithGoogle";
import { auth } from "~/utils/auth";
import type { MyEnv } from "~/utils/types";

export const authRoutes = new Hono<MyEnv>()

authRoutes

    .get("/", async c => {
        const session = c.var.session
        if (session) return c.redirect("/")
        return c.html(
            <Layout>
                <SignInWithGoogle />
            </Layout>
        )
    })
    .get("/google", async c => {
        const session = c.var.session
        if (session) return c.redirect("/")
        const res = await auth.api.signInSocial({
            asResponse: true,
            body: {
                provider: "google",
            },
        })
        const cookie = res.headers.get("set-cookie")
        const location = res.headers.get("location")
        if (!cookie || !location) return c.text("OOPS", 500)
        c.header("Set-Cookie", cookie)
        return c.redirect(location)
    })
    .post("/key", async c => {
        const user = await auth.api.getSession({
            headers: c.req.raw.headers
        })
        if (!user) return c.redirect("/auth")
        const key = await auth.api.createApiKey({
            headers: c.req.raw.headers,
            body: {

            }
        })
        return c.json({ key })
    })