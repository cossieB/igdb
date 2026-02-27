import { OpenAPIHono } from '@hono/zod-openapi'
import packageJson from "../package.json"
import { actorRoutes } from './routes/actors'
import { Scalar } from '@scalar/hono-api-reference'

const app = new OpenAPIHono<{ Bindings: Cloudflare.Env }>()

app.get('/', (c) => {
    return c.text('Hello Hono!')
})

app.route("/actors", actorRoutes)

app.doc("/docs", {
    openapi: "3.0.0",
    info: {
        version: packageJson.version,
        title: "IGDB"
    }
})

app.get("/scalar", Scalar({url: "/docs"}))

export default app
