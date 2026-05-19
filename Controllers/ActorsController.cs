using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using igdb.Dtos;
using igdb.Models;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
[Route("[controller]")]
public class ActorsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _dbContext = context;

    [ProducesResponseType(typeof(ActorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var actor = await _dbContext.Actors.FirstOrDefaultAsync(x => x.ActorId == id);
        if (actor is null) return NotFound();
        return Ok(actor.Adapt<ActorDto>());
    }
    
    [ProducesResponseType(typeof(List<ActorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpGet]
    async public Task<IActionResult> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var actors = await _dbContext.Actors
            .OrderBy(x => x.ActorId)
            .Where(actor => actor.ActorId > cursor)
            .Take(limit)
            .ToListAsync();

        return Ok(actors.Adapt<List<ActorDto>>());
    }

    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await _dbContext.GameActors
            .OrderBy(x => x.GameId)
            .Where(x => x.ActorId == id)
            .Where(x => x.GameId > cursor)
            .Select(x => x.Game)
            .Take(limit)
            .ToListAsync();

        return Ok(games.Adapt<List<GameDto>>());
    } 
    
    [HttpGet("{id:int:min(1)}/roles")]    
    async public Task<ActionResult<List<RolesDto>>> GetRoles(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var roles = await _dbContext.GameActors
            .OrderBy(x => x.AppearanceId)
            .Where(x => x.ActorId == id)
            .Where(x => x.AppearanceId > cursor)
            .Take(limit)
            .ToListAsync();

        return Ok(roles.Adapt<List<RolesDto>>());
    }
}