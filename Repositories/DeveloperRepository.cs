using System;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class DeveloperRepository(AppDbContext _context)
{
    private readonly AppDbContext dbContext = _context;
    async public Task<List<DeveloperDto>> FindDevelopers(int cursor, int limit)
    {
        var developers = dbContext.Developers
            .Where(dev => dev.DeveloperId > cursor)
            .OrderBy(dev => dev.DeveloperId)
            .Take(limit)
            .ToListAsync();

        return developers.Adapt<List<DeveloperDto>>();
    }

    async public Task<DeveloperDto?> FindDeveloper(int id)
    {
        var developer = await dbContext.Developers.FirstOrDefaultAsync(dev => dev.DeveloperId == id);
        return developer?.Adapt<DeveloperDto>();
    }
}
