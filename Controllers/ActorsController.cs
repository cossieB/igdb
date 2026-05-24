using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace igdb.Controllers;
[ApiController]
// [Authorize]
[Route("[controller]")]
public class ActorsController(ActorRepository actorRepository, GameRepository gameRepository) : ControllerBase
{
    private readonly ActorRepository actorRepository = actorRepository;
    private readonly GameRepository gameService = gameRepository;

    [ProducesResponseType(typeof(ActorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var actor = await actorRepository.FindById(id);
        if (actor is null) return NotFound();
        return Ok(actor);
    }
    
    [ProducesResponseType(typeof(List<ActorDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpGet]
    async public Task<IActionResult> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var actors = actorRepository.FindAll(cursor, limit);
        return Ok(actors);
    }

    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameService.FindAll(cursor, limit, actorId: id);
        return Ok(games);
    } 
    
    // [HttpGet("{id:int:min(1)}/roles")]    
    // async public Task<ActionResult<List<RolesDto>>> GetRoles(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    // {
    //     var roles = await _dbContext.GameActors
    //         .OrderBy(x => x.AppearanceId)
    //         .Where(x => x.ActorId == id)
    //         .Where(x => x.AppearanceId > cursor)
    //         .Take(limit)
    //         .ToListAsync();

    //     return Ok(roles.Adapt<List<RolesDto>>());
    // }
}