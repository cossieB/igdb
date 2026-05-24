using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class ActorRepository(AppDbContext context)
{
    private readonly AppDbContext _dbContext = context;
    async public Task<ActorDto?> FindById(int id)
    {
        var actor = await _dbContext.Actors.FirstOrDefaultAsync(x => x.ActorId == id);
        return actor?.Adapt<ActorDto>();
    }
    async public Task<List<ActorDto>> FindAll(
        int cursor,
        int limit,
        int? gameId = null
    )
    {
        var query = _dbContext.Actors
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
}