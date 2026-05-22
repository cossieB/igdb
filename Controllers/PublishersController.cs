using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class PublishersController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _dbContext = context;

    [ProducesResponseType(typeof(PublisherDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var pub = await _dbContext.Publishers.FirstOrDefaultAsync(x => x.PublisherId == id);
        if (pub is null) return NotFound();
        return Ok(pub.Adapt<PublisherDto>());
    }
    
    [HttpGet]
    async public Task<ActionResult<List<PublisherDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var pubs = await _dbContext.Publishers
            .OrderBy(publisher => publisher.PublisherId)
            .Where(publisher => publisher.PublisherId > cursor)
            .Take(limit)
            .ToListAsync();

        return Ok(pubs.Adapt<List<PublisherDto>>());
    }
    
    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await _dbContext.Games
            .Where(g => g.PublisherId == id)
            .Where(g => g.GameId > cursor)
            .OrderBy(g => g.GameId)
            .Take(limit)
            .ToListAsync();

        return Ok(games.Adapt<List<GameDto>>());
    }
}