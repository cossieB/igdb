using System;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace igdb.Repositories;

public class PublisherRepository(AppDbContext _context)
{
    private readonly AppDbContext dbContext = _context;
    async public Task<List<PublisherDto>> FindAll(int cursor, int limit)
    {
        var Publishers = await dbContext.Publishers
            .Where(dev => dev.PublisherId > cursor)
            .OrderBy(dev => dev.PublisherId)
            .Take(limit)
            .ToListAsync();

        return Publishers.Adapt<List<PublisherDto>>();
    }

    async public Task<PublisherDto?> FindById(int id)
    {
        var Publisher = await dbContext.Publishers.FirstOrDefaultAsync(dev => dev.PublisherId == id);
        return Publisher?.Adapt<PublisherDto>();
    }

    async public Task<PublisherDto> CreatePublisher(PublisherCreateDto dto)
    {
        var Publisher = new Publisher
        {
            Country = dto.Country,
            Headquarters = dto.Headquarters,
            Logo = dto.Logo,
            Name = dto.Name,
            Summary = dto.Summary,
            DateModified = DateTime.UtcNow
        };
        dbContext.Publishers.Add(Publisher);
        await dbContext.SaveChangesAsync();
        return Publisher.Adapt<PublisherDto>();
    }

    async public Task<PublisherDto?> UpdatePublisher(int id, PublisherUpdateDto dto)
    {
        var publisher = await dbContext.Publishers.FirstOrDefaultAsync(d => d.PublisherId == id);
        if (publisher is null) return null;
        if (dto.Country is not null) publisher.Country = dto.Country;
        if (dto.Headquarters is not null) publisher.Headquarters = dto.Headquarters;
        if (dto.Logo is not null) publisher.Logo = dto.Logo;
        if (dto.Name is not null) publisher.Name = dto.Name;
        if (dto.Summary is not null) publisher.Summary = dto.Summary;
        publisher.DateModified = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return publisher.Adapt<PublisherDto>();
    }
}
