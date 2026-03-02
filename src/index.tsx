import { OpenAPIHono } from '@hono/zod-openapi'
import packageJson from "../package.json"
import { actorRoutes } from './routes/actors'
import { Scalar } from '@scalar/hono-api-reference'
import { gamesRoutes } from './routes/games'
import { developerRoutes } from './routes/developers'
import { publisherRoutes } from './routes/publishers'
import { platformRoutes } from './routes/platforms'
import { betterAuthRoutes as betterAuthRoutes } from './routes/betterAuth'
import { authRoutes } from './routes/auth'
import { setSession } from './middleware/setSessions'
import type { MyEnv } from './utils/types'

const app = new OpenAPIHono<MyEnv>()

app.use(setSession)

app.get('/', (c) => {
    const session = c.var.session
    if (!session) return c.redirect("/auth")
    return c.text('Hello Hono!')
})

app
    .route("/api/actors", actorRoutes)
    .route("/api/games", gamesRoutes)
    .route("/api/developers", developerRoutes)
    .route("/api/publishers", publisherRoutes)
    .route("/api/platforms", platformRoutes)
    .route("/api/auth/*", betterAuthRoutes)
    .route("/auth", authRoutes)

app.doc("/docs", {
    openapi: "3.0.0",
    info: {
        version: packageJson.version,
        title: "IGDB"
    }
})

app.get("/scalar", Scalar({url: "/docs"}))

export default app