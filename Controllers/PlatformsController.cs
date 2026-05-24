using System.ComponentModel.DataAnnotations;
using igdb.Dtos;
using igdb.Repositories;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace igdb.Controllers;

[ApiController]
// [Authorize]
[Route("[controller]")]
public class PlatformsController(PlatformRepository _platformRepository, GameRepository _gameRepository) : ControllerBase
{
    private readonly PlatformRepository platformRepository = _platformRepository;
    private readonly GameRepository gameRepository = _gameRepository;

    [HttpGet]
    public async Task<ActionResult<List<PlatformDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var platforms = await platformRepository.FindAll(cursor, limit);
        return Ok(platforms);
    }
    [ProducesResponseType(typeof(PlatformDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    public async Task<IActionResult> GetById(int id)
    {
        var platform = await platformRepository.FindById(id);
        if (platform is null) return NotFound();
        return Ok(platform);
    }

    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameRepository.FindAll(cursor, limit, platformId: id);
        return Ok(games.Adapt<List<GameDto>>());
    }

    [HttpPost]
    async public Task<ActionResult<PlatformDto>> AddPlatform(PlatformCreateDto dto)
    {
        var platform = await platformRepository.CreatePlatform(dto);
        return Created($"/platforms/{platform.PlatformId}", platform);
    }
    
    [ProducesResponseType(typeof(PlatformDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpPatch("{id:int:min(1)}")]
    async public Task<IActionResult> UpdatePlatform(int id, PlatformUpdateDto dto)
    {
        var platform = await platformRepository.UpdatePlatform(id, dto);
        if (platform is null) return NotFound();
        return Ok(platform);
    }
}
