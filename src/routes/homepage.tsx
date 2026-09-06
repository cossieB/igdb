import type { Handler } from "hono";
import { Layout } from "~/ui/Layout";
import type { MyEnv } from "~/utils/types";

export const homePage: Handler<MyEnv> = c => {
    const user = c.var.user
    if (!user) return c.redirect("/auth")
    
    return c.html(
        <Layout>
            <div id='keyDiv'>
                <button id="genBtn">Get API Key</button>
                <code></code>
            </div>
            <pre></pre>
            {user.role === "admin" && 
                <>
                    <button id="adminBtn">Get Admin Key</button>
                </>
            }
        </Layout>
    )
}