using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class ActorRolesRepository(AppDbContext context)
{
    private readonly AppDbContext dbContext = context;
    async public Task<List<ActorRolesDto>> FindAllByActor(int actorId, int cursor, int limit)
    {
        var roles = await dbContext.GameActors
            .Where(ga => ga.ActorId == actorId)
            .Where(ga => ga.AppearanceId > cursor)
            .OrderBy(ga => ga.AppearanceId)
            .Take(limit)
            .ToListAsync();
        return roles.Adapt<List<ActorRolesDto>>();
    }
}