using System;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class DeveloperRepository(AppDbContext _context)
{
    private readonly AppDbContext dbContext = _context;
    async public Task<List<DeveloperDto>> FindAll(int cursor, int limit)
    {
        var developers = await dbContext.Developers
            .Where(dev => dev.DeveloperId > cursor)
            .OrderBy(dev => dev.DeveloperId)
            .Take(limit)
            .ToListAsync();

        return developers.Adapt<List<DeveloperDto>>();
    }

    async public Task<DeveloperDto?> FindById(int id)
    {
        var developer = await dbContext.Developers.FirstOrDefaultAsync(dev => dev.DeveloperId == id);
        return developer?.Adapt<DeveloperDto>();
    }

    async public Task<DeveloperDto> CreateDeveloper(DeveloperCreateDto dto)
    {
        var developer = new Developer
        {
            Country = dto.Country,
            Location = dto.Location,
            Logo = dto.Logo,
            Name = dto.Name,
            Summary = dto.Summary,
            DateModified = DateTime.UtcNow
        };
        dbContext.Developers.Add(developer);
        await dbContext.SaveChangesAsync();
        return developer.Adapt<DeveloperDto>();
    }

    async public Task<DeveloperDto?> UpdateDeveloper(int id, DeveloperUpdateDto dto)
    {
        var developer = await dbContext.Developers.FirstOrDefaultAsync(d => d.DeveloperId == id);
        if (developer is null) return null;
        if (dto.Country is not null) developer.Country = dto.Country;
        if (dto.Location is not null) developer.Location = dto.Location;
        if (dto.Logo is not null) developer.Logo = dto.Logo;
        if (dto.Name is not null) developer.Name = dto.Name;
        if (dto.Summary is not null) developer.Summary = dto.Summary;
        developer.DateModified = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return developer.Adapt<DeveloperDto>();
    }
}
