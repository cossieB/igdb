import { describe, it, expect } from "vitest";
import app from "..";
import assert from "node:assert";
import { auth } from "~/utils/auth";
import { db } from "~/drizzle/db";
import { developers, users } from "~/drizzle/schema";

const routes = ["/api/games", "/api/actors", "/api/developers", "/api/publishers", "/api/platforms"]
describe("Access Tests", () => {

    it("should respond with 401 errors", async () => {
        for (const route of routes) {
            const res = await app.request(route);
            assert(res.status == 401)
            assert(res.headers.get("content-type") == "application/json")
            const data = await res.json()
            expect(data).toHaveProperty("error.message")
        }
    })

    it("should respond with 403 errors", async () => {
        //setup
        const [user] = await db.insert(users).values({ email: "123@abc.com", id: "abc", name: "John Doe" }).returning()
        const obj = await auth.api.createApiKey({
            body: {
                userId: user.id,
                configId: "user"
            }
        })

        //actual tests
        for (const route of routes) {
            const res = await app.request(route, {
                method: "post",
                headers: {
                    "x-api-key": obj.key
                }
            })
            expect(res.status).toBe(403)
            expect(res.headers.get("content-type")).toBe("application/json")
            const data = await res.json()
            expect(data).toHaveProperty("error.message")
        }
    })
    it("should respond with 403 errors", async () => {
        //setup        
        const [dev] = await db.insert(developers).values({ logo: "test.png", name: "test" }).returning()
        const [user] = await db.insert(users).values({ email: "123@abc.com", id: "abc", name: "John Doe" }).returning()

        const obj = await auth.api.createApiKey({
            body: {
                userId: user.id,
                configId: "user"
            }
        })
        //actual tests
        const res = await app.request("/api/developers/" + dev.developerId, {
            method: "delete",
            headers: {
                "x-api-key": obj.key
            }
        })
        expect(res.status).toBe(403)
        expect(res.headers.get("content-type")).toBe("application/json")
        const data = await res.json()
        expect(data).toHaveProperty("error.message")
    })
})