import { Hono } from "hono";
import { Layout } from "~/ui/Layout";
import { GithubSignin } from "~/ui/SignInWithGithub";
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
                <div style={{ display: "flex" }}>
                    <SignInWithGoogle />
                    <GithubSignin />
                </div>
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
            headers: c.req.raw.headers
        })        
        const data = await res.json() as {url: string, redirect: boolean};        
        const headers = new Headers(res.headers)        
        headers.set("Location", data.url)        
        return new Response(null, {
            status: 302,
            headers
        })
    })
    .get("/github", async c => {
        const session = c.var.session
        if (session) return c.redirect("/")

        const res = await auth.api.signInSocial({
            asResponse: true,
            body: {
                provider: "github",
                callbackURL: "/",
            },
            headers: c.req.raw.headers
        })        
        const data = await res.json() as {url: string, redirect: boolean}       
        const headers = new Headers(res.headers)        
        headers.set("Location", data.url)        
        return new Response(null, {
            status: 302,
            headers
        })
    })