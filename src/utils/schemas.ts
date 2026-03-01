import z from "zod";

export const ErrorSchema = z.object({
    error: z.string()
})

export const QuerySchema = z.object({
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().min(1).optional().default(10).transform(num => num > 50 ? 50 : num).openapi({
        maximum: 50
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