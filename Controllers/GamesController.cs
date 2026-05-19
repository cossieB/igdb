using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
[Route("[controller]")]
public class GamesController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _dbContext = context;

    [HttpGet]
    async public Task<ActionResult<List<GameDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await _dbContext.Games
            .Where(game => game.GameId > cursor)
            .OrderBy(game => game.GameId)
            .Take(limit)
            .ToListAsync();

        return Ok(games.Adapt<List<GameDto>>());
    }
    [ProducesResponseType(typeof(GameDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var game = await _dbContext.Games.FirstOrDefaultAsync(game => game.GameId == id);
        if (game is null) return NotFound();
        return Ok(game.Adapt<GameDto>());
    }

    [HttpGet("{id:int:min(1)}/platforms")]
    async public Task<ActionResult<List<PlatformDto>>> GetPlatforms(int id)
    {
        var platforms = await _dbContext.Platforms
            .Where(p => p.Games.Any(g => g.GameId == id))
            .ToListAsync();

        return Ok(platforms.Adapt<List<PlatformDto>>());
    }

    [HttpGet("{id:int:min(1)}/genres")]
    async public Task<ActionResult<List<GenreDto>>> GetGenres(int id)
    {
        var genres = await _dbContext.Genres
            .Where(p => p.Games.Any(g => g.GameId == id))
            .ToListAsync();

        return Ok(genres.Adapt<List<GenreDto>>());        
    }

    [HttpGet("{id:int:min(1)}/actors")]
    async public Task<ActionResult<List<ActorDto>>> GetActors(int id)
    {
        var actors = await _dbContext.Actors
            .Where(p => p.GameActors.Any(g => g.GameId == id))
            .ToListAsync();        

        return Ok(actors.Adapt<List<ActorDto>>());
    }
}