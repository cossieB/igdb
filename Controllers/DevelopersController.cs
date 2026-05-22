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
public class DevelopersController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _dbContext = context;

    [ProducesResponseType(typeof(DeveloperDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var dev = await _dbContext.Developers.FirstOrDefaultAsync(x => x.DeveloperId == id);
        if (dev is null) return NotFound();
        return Ok(dev.Adapt<DeveloperDto>());
    }
    
    [HttpGet]
    async public Task<ActionResult<List<DeveloperDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var devs = await _dbContext.Developers
            .OrderBy(dev => dev.DeveloperId)
            .Where(dev => dev.DeveloperId > cursor)
            .Take(limit)
            .ToListAsync();

        return Ok(devs.Adapt<List<DeveloperDto>>());
    }
    
    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await _dbContext.Games
            .Where(g => g.DeveloperId == id)
            .Where(g => g.GameId > cursor)
            .OrderBy(g => g.GameId)
            .Take(limit)
            .ToListAsync();

        return Ok(games.Adapt<List<GameDto>>());
    }
}