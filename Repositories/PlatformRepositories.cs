using System;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class PlatformRepository(AppDbContext _context)
{
    private readonly AppDbContext dbContext = _context;
    async public Task<List<PlatformDto>> FindAll(int cursor, int limit)
    {
        var platforms = await dbContext.Platforms
            .Where(dev => dev.PlatformId > cursor)
            .OrderBy(dev => dev.PlatformId)
            .Take(limit)
            .ToListAsync();

        return platforms.Adapt<List<PlatformDto>>();
    }

    async public Task<PlatformDto?> FindById(int id)
    {
        var Platform = await dbContext.Platforms.FirstOrDefaultAsync(dev => dev.PlatformId == id);
        return Platform?.Adapt<PlatformDto>();
    }

    async public Task<PlatformDto> CreatePlatform(PlatformCreateDto dto)
    {
        var Platform = new Platform
        {
            Name = dto.Name,
            ReleaseDate = dto.ReleaseDate,
            Logo = dto.Logo,
            Summary = dto.Summary,
            DateModified = DateTime.UtcNow
        };
        dbContext.Platforms.Add(Platform);
        await dbContext.SaveChangesAsync();
        return Platform.Adapt<PlatformDto>();
    }

    async public Task<PlatformDto?> UpdatePlatform(int id, PlatformUpdateDto dto)
    {
        var platform = await dbContext.Platforms.FirstOrDefaultAsync(d => d.PlatformId == id);
        if (platform is null) return null;
        if (dto.Logo is not null) platform.Logo = dto.Logo;
        if (dto.Name is not null) platform.Name = dto.Name;
        if (dto.Summary is not null) platform.Summary = dto.Summary;
        if (dto.ReleaseDate is not null) platform.ReleaseDate = (DateOnly)dto.ReleaseDate;
        platform.DateModified = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return platform.Adapt<PlatformDto>();
    }
}
