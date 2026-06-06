using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Repositories;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace igdb.Controllers;
[ApiController]
// [Authorize]
[EnableRateLimiting("UserLimitPolicy")]
[Route("[controller]")]
public class DevelopersController(DeveloperRepository developerRepository, GameRepository gameRepository) : ControllerBase
{    
    [ProducesResponseType(typeof(DeveloperDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var dev = await developerRepository.FindById(id);
        if (dev is null) return NotFound();
        return Ok(dev.Adapt<DeveloperDto>());
    }
    
    [HttpGet]
    async public Task<ActionResult<List<DeveloperDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var devs = await developerRepository.FindAll(cursor, limit);
        return Ok(devs);
    }
    
    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameRepository.FindAll(cursor, limit, developerId: id);
        return Ok(games.Adapt<List<GameDto>>());
    }
    [Authorize(Roles = "Admin"), DisableRateLimiting]
    [HttpPost]
    async public Task<ActionResult<DeveloperDto>> AddDeveloper(DeveloperCreateDto dto)
    {
        var developer = await developerRepository.CreateDeveloper(dto);
        return Created($"/developers/{developer.DeveloperId}", developer);
    }
    [Authorize(Roles = "Admin"), DisableRateLimiting]
    [HttpPatch("{id:int:min(1)}")]
    async public Task<IActionResult> UpdateDeveloper(int id, DeveloperUpdateDto dto)
    {
        var developer = await developerRepository.UpdateDeveloper(id, dto);
        if (developer is null) return NotFound();
        return Ok(developer);
    }
}