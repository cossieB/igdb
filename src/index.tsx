import { OpenAPIHono } from '@hono/zod-openapi'
import packageJson from "../package.json"
import { actorRoutes } from './routes/actors'
import { Scalar } from '@scalar/hono-api-reference'
import { gamesRoutes } from './routes/games'
import { developerRoutes } from './routes/developers'
import { publisherRoutes } from './routes/publishers'
import { platformRoutes } from './routes/platforms'
import { betterAuthRoutes } from './routes/betterAuth'
import { authRoutes } from './routes/auth'
import { setSession } from './middleware/setSessions'
import type { MyEnv } from './utils/types'
import { keyRoutes } from './routes/keys'
import { homePage } from './routes/homepage'

const app = new OpenAPIHono<MyEnv>()

app.use(setSession)

app
    .get('/', homePage)
    .route("/auth", authRoutes)
    .route("/api/auth/*", betterAuthRoutes)
    .route("/api/actors", actorRoutes)
    .route("/api/games", gamesRoutes)
    .route("/api/developers", developerRoutes)
    .route("/api/publishers", publisherRoutes)
    .route("/api/platforms", platformRoutes)
    .route("/api/keys", keyRoutes)
    .get("/scalar", Scalar({ url: "/docs" }))

app.doc("/docs", {
    openapi: "3.0.0",
    info: {
        version: packageJson.version,
        title: "IGDB"
    }
})


export default app