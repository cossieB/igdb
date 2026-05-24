using System;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class GameRepository(AppDbContext context)
{
    private readonly AppDbContext dbContext = context;

    public async Task<List<GameDto>> FindAll(
        int cursor,
        int limit,
        int? developerId = null,
        int? publisherId = null,
        int? platformId = null,
        int? actorId = null
    )
    {
        var query = dbContext.Games
            .Where(game => game.GameId > cursor);

        if (developerId is not null)
        {
            query = query.Where(game => game.DeveloperId == developerId);
        }
        if (publisherId is not null)
        {
            query = query.Where(game => game.PublisherId == publisherId);
        }
        if (platformId is not null)
        {
            query = query.Where(game => game.Platforms.Any(platform => platform.PlatformId == platformId));
        }
        if (actorId is not null)
        {
            query = query.Where(game => game.GameActors.Any(ga => ga.ActorId == actorId));
        }
        var games = await query
            .OrderBy(game => game.GameId)
            .Take(limit)
            .ToListAsync();

        return games.Adapt<List<GameDto>>();
    }
    async public Task<object?> FindById(int id)
    {
        var game = await dbContext
        .Games
        .Include(g => g.Developer)
        .Include(g => g.Publisher)
        .Include(g => g.Genres)
        .Include(g => g.GameActors)
        .ThenInclude(ga => ga.Actor)
        .Include(g => g.Media)
        .Include(g => g.Platforms)
        .FirstOrDefaultAsync(game => game.GameId == id);

        if (game is null) return null;

        var g = new
        {
            game.Title,
            game.Banner,
            game.Cover,
            Developer = new
            {
                game.DeveloperId,
                game.Developer.Name
            },
            Publisher = new
            {
                game.PublisherId,
                game.Publisher.Name
            },
            Platforms = game.Platforms.Select(p => new
            {
                p.PlatformId,
                p.Name
            }),
            Genres = game.Genres.Select(g => g.Name),
            game.Summary,
            game.ReleaseDate,
            game.Trailer,
            Media = game.Media.Adapt<List<MediaDto>>(),
            Cast = game.GameActors.Select(ga => new
            {
               ga.Character,
               ga.ActorId,
               ActorName = ga.Actor.Name,
               ga.RoleType
            }),
        };

        return g;
    }
    async public Task<GameDto> AddGame(CreateGameRequest request)
    {
        request.Genres = [.. request.Genres.Select(g => g.ToLower())];
        var genres = await dbContext.Genres.Where(g => request.Genres.Contains(g.Name)).ToListAsync();
        var platforms = await dbContext.Platforms.Where(p => request.Platforms.Contains(p.PlatformId)).ToListAsync();

        var newGame = new Game
        {
            Title = request.Title,
            DeveloperId = request.DeveloperId,
            PublisherId = request.PublisherId,
            Banner = request.Banner,
            Cover = request.Cover,
            Trailer = request.Trailer,
            Summary = request.Summary,
            Genres = genres,
            Platforms = platforms,
            ReleaseDate = request.ReleaseDate,
            DateModified = DateTime.UtcNow
        };
        var g = dbContext.Games.Add(newGame);

        List<Media> media = [.. request.Media.Select(m => new Media
            {
                ContentType = m.ContentType,
                Game = newGame,
                Key = m.Key
            })];

        dbContext.Media.AddRange(media);

        await dbContext.SaveChangesAsync();
        return newGame.Adapt<GameDto>();
    }
    async public Task<GameDto?> UpdateGame(int id, UpdateGameRequest request)
    {
        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.GameId == id);
        if (game is null) return null;
        using var tx = await dbContext.Database.BeginTransactionAsync();

        if (request.Title is not null) game.Title = request.Title;
        if (request.DeveloperId is not null) game.DeveloperId = (int)request.DeveloperId;
        if (request.PublisherId is not null) game.PublisherId = (int)request.PublisherId;
        if (request.Banner is not null) game.Banner = request.Banner;
        if (request.Cover is not null) game.Cover = request.Cover;
        if (request.Summary is not null) game.Summary = request.Summary;
        if (request.Trailer is not null) game.Trailer = request.Trailer;
        if (request.Genres is not null)
        {
            request.Genres = [.. request.Genres.Select(g => g.ToLower().Trim())];
            if (request.Genres.Count == 0)
                await dbContext.Database.ExecuteSqlAsync($"DELETE FROM game_genres WHERE game_id = {id}");
            else
            {
                await dbContext.Database.ExecuteSqlAsync($"DELETE FROM game_genres WHERE game_id = {id} AND NOT (genre = ANY({request.Genres.ToArray()}))");

                //Insert game genres ignoring genres that aren't in the genres table
                await dbContext.Database.ExecuteSqlAsync($@"
                    INSERT INTO game_genres (game_id, genre)
                    SELECT {id}, g.name
                    FROM genres g
                    WHERE g.name = ANY({request.Genres.ToArray()})
                    ON CONFLICT DO NOTHING
                ");
            }
        }
        if (request.Platforms is not null)
        {
            if (request.Platforms.Count == 0)
                await dbContext.Database.ExecuteSqlAsync($"DELETE FROM game_platforms WHERE game_id = {id}");
            else
            {
                await dbContext.Database.ExecuteSqlAsync($"DELETE FROM game_platforms WHERE game_id = {id} AND NOT (platform_id = ANY({request.Platforms.ToArray()}) )");
                // Will error and rollback when a platform isn't in the platforms table
                await dbContext.Database.ExecuteSqlAsync($@"
                    INSERT INTO game_platforms (game_id, platform_id) 
                    SELECT {id}, p_id 
                    FROM UNNEST({request.Platforms.ToArray()}) AS p_id 
                    ON CONFLICT(game_id, platform_id) DO NOTHING
                ");
            }
        }
        if (request.Media is not null)
        {
            if (request.Media.Count == 0)
                await dbContext.Database.ExecuteSqlAsync($"UPDATE media SET game_id = null WHERE game_id = {id}");
            else
            {
                var keys = request.Media.Select(m => m.Key).ToArray();
                var types = request.Media.Select(m => m.ContentType).ToArray();
                await dbContext.Database.ExecuteSqlAsync($"UPDATE media SET game_id = null WHERE game_id = {id} AND NOT (key = ANY({keys.ToArray()}))");
                await dbContext.Database.ExecuteSqlAsync($@"
                    INSERT INTO media (game_id, key, content_type)
                    SELECT {id}, UNNEST({keys}), UNNEST({types})
                    ON CONFLICT (key) DO NOTHING
                ");
            }
        }
        game.DateModified = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        await tx.CommitAsync();
        return game.Adapt<GameDto>();
    }
}
