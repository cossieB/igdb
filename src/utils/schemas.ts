import z from "zod";
import { GameSelectSchema } from "~/drizzle/models";

export const ErrorSchema = z.object({
    error: z.object({
        message: z.string(),
        name: z.string().optional(),
        code: z.string().optional()
    })
})

export const QuerySchema = z.object({
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().min(1).optional().default(10).transform(num => Math.min(num, 20)).openapi({
        maximum: 20
    })
})

export const GameCreateSchema = z.object({
    title: z.string(),
    developerId: z.number(),
    publisherId: z.number(),
    banner: z.string(),
    cover: z.string(),
    summary: z.string().optional(),
    releaseDate: z.iso.date(),
    trailer: z.string().nullish(),
    media: z.array(z.object({
        key: z.string(),
        contentType: z.string()
    })),
    platforms: z.number().array(),
    genres: z.string().array()
})

export const GameEditSchema = GameCreateSchema.partial().extend({ gameId: z.number() })

export const ApiHeaderSchema = z.object({
    "x-api-key": z.string().openapi({ example: "uk_MXMKGQvuxElpAYhVwgNDGcAgPZqhUjOyziBIKbJUPCfOXiHBBIISNcfRAJyDHSnK" })
})

export const NumberIdSchema = z.object({
    id: z.coerce.number()
        .openapi({
            example: 7,
            param: {
                in: "path",
                required: true,
                name: "id"
            }
        })
})

export const GameSchema = GameSelectSchema.extend({
    genres: z.string().array().openapi({ example: ["action rpg", "sci-fi"] }),
    platforms: z.object({
        platformId: z.number()
    }).array()
})

export const ReviewInsert = z.object({
    text: z.string().max(500),
    score: z.int().min(1).max(5)
});