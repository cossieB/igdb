using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
[Route("[controller]")]
public class PlatformsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _dbContext = context;

    [HttpGet]
    public async Task<ActionResult<List<PlatformDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var platforms = await _dbContext.Platforms
            .OrderBy(platform => platform.PlatformId)
            .Take(limit)
            .Where(platform => platform.PlatformId > cursor)
            .ToListAsync();

        return Ok(platforms.Adapt<List<PlatformDto>>());
    }
    [ProducesResponseType(typeof(PlatformDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    public async Task<IActionResult> GetById(int id)
    {
        var platform = await _dbContext.Platforms.FirstOrDefaultAsync(platform => platform.PlatformId == id);
        if (platform is null) return NotFound();
        return Ok(platform.Adapt<PlatformDto>());
    }

    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await _dbContext.Games
            .Where(game => game.Platforms.Any(platform => platform.PlatformId == id))
            .Where(game => game.GameId > cursor)
            .OrderBy(game => game.GameId)
            .Take(limit)
            .ToListAsync();

        return Ok(games.Adapt<List<GameDto>>());
    }
}
