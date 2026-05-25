using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace igdb.Controllers;

[ApiController]
// [Authorize]
[EnableRateLimiting("UserLimitPolicy")]
[Route("[controller]")]
public class ActorsController(ActorRepository actorRepository, GameRepository gameRepository, ActorRolesRepository actorRolesRepository) : ControllerBase
{
    private readonly ActorRepository actorRepository = actorRepository;
    private readonly GameRepository gameService = gameRepository;
    private readonly ActorRolesRepository actorRolesRepository = actorRolesRepository;

    [ProducesResponseType(typeof(ActorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var actor = await actorRepository.FindById(id);
        if (actor is null) return NotFound();
        return Ok(actor);
    }
    
    [HttpGet]
    async public Task<ActionResult<List<ActorDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var actors = await actorRepository.FindAll(cursor, limit);
        return Ok(actors);
    }

    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameService.FindAll(cursor, limit, actorId: id);
        return Ok(games);
    } 
    
    [HttpGet("{id:int:min(1)}/roles")]    
    async public Task<ActionResult<List<ActorRolesDto>>> GetRoles(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 50)] int limit = 20)
    {
        var roles = await actorRolesRepository.FindAllByActor(id, cursor, limit);
        return Ok(roles);
    }
    [Authorize(Roles = "Admin"), DisableRateLimiting]    
    [HttpPost]
    async public Task<ActionResult<ActorDto>> CreateActor(ActorCreateDto dto)
    {
        var actor = await actorRepository.AddActor(dto);
        return Created($"/actors/{actor.ActorId}", actor);
    }

    [ProducesResponseType(typeof(ActorDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(Roles = "Admin"), DisableRateLimiting]    
    [HttpPatch("{id:int:min(1)}")]
    async public Task<IActionResult> UpdateActor(int id, ActorUpdateDto dto)
    {
        var actor = await actorRepository.UpdateActor(id, dto);
        if (actor is null) return NotFound();
        return Ok(actor);
    }
}