using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class ActorRepository(AppDbContext context)
{
    private readonly AppDbContext dbContext = context;
    async public Task<ActorDto?> FindById(int id)
    {
        var actor = await dbContext.Actors.FirstOrDefaultAsync(x => x.ActorId == id);
        return actor?.Adapt<ActorDto>();
    }
    async public Task<List<ActorDto>> FindAll(
        int cursor,
        int limit,
        int? gameId = null
    )
    {
        var query = dbContext.Actors
            .OrderBy(x => x.ActorId)
            .Where(actor => actor.ActorId > cursor);

        if (gameId is not null)
        {
            query = query.Where(actor => actor.GameActors.Any(ga => ga.GameId == gameId));
        }
        var actors = await query.Take(limit)
            .ToListAsync();

        return actors.Adapt<List<ActorDto>>();
    }

    async public Task<ActorDto> AddActor(ActorCreateDto actor)
    {
        var newActor = new Actor
        {
            Bio = actor.Bio,
            Name = actor.Name,
            Photo = actor.Photo,
            DateModified = DateTime.UtcNow
        };
        dbContext.Actors.Add(newActor);
        await dbContext.SaveChangesAsync();
        return newActor.Adapt<ActorDto>();
    }

    async public Task<ActorDto?> UpdateActor(int id, ActorUpdateDto dto)
    {
        var actor = await dbContext.Actors.FirstOrDefaultAsync(a => a.ActorId == id);
        if (actor is null) return null;
        if (dto.Name is not null) actor.Name = dto.Name;
        if (dto.Photo is not null) actor.Photo = dto.Photo;
        if (dto.Bio is not null) actor.Bio = dto.Bio;
        actor.DateModified = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return actor.Adapt<ActorDto>();
    }
}