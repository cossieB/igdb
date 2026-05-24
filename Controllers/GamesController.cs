using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using igdb.Dtos;
using igdb.Models;
using igdb.Repositories;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
// [Authorize]
[Route("[controller]")]
public class GamesController(GameRepository gameRepository) : ControllerBase
{
    [HttpGet]
    async public Task<ActionResult<List<GameDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameRepository.FindAll(cursor, limit);
        return Ok(games);
    }
    [ProducesResponseType(typeof(GameDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var game = await gameRepository.FindById(id);
        if (game is null) return NotFound();
        return Ok(game);
    }

    // [HttpGet("{id:int:min(1)}/platforms")]
    // async public Task<ActionResult<List<PlatformDto>>> GetPlatforms(int id)
    // {
    //     var platforms = await _dbContext.Platforms
    //         .Where(p => p.Games.Any(g => g.GameId == id))
    //         .ToListAsync();

    //     return Ok(platforms.Adapt<List<PlatformDto>>());
    // }

    // [HttpGet("{id:int:min(1)}/genres")]
    // async public Task<ActionResult<List<GenreDto>>> GetGenres(int id)
    // {
    //     var genres = await _dbContext.Genres
    //         .Where(p => p.Games.Any(g => g.GameId == id))
    //         .ToListAsync();

    //     return Ok(genres.Adapt<List<GenreDto>>());
    // }

    // [HttpGet("{id:int:min(1)}/actors")]
    // async public Task<ActionResult<List<ActorDto>>> GetActors(int id)
    // {
    //     var actors = await _dbContext.Actors
    //         .Where(p => p.GameActors.Any(g => g.GameId == id))
    //         .ToListAsync();

    //     return Ok(actors.Adapt<List<ActorDto>>());
    // }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    async public Task<IActionResult> AddGame(CreateGameRequest request)
    {
        try
        {
            var game = await gameRepository.AddGame(request);
            return Created($"/games/{game.GameId}", game.Adapt<GameDto>());
        }
        catch (DbUpdateException e)
        {
            if (e.InnerException?.Message.Contains("foreign key constraint") == true)
            {
                return BadRequest(new { error = "Foreign key constraints failed" });
            }
            return Problem(e.InnerException?.Message ?? "Something went wrong. Please try again later");
        }
        catch
        {
            return Problem("Something went wrong. Please try again later");
        }
    }
    [ProducesResponseType(typeof(GameDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}")]
    async public Task<IActionResult> UpdateGame(int id, UpdateGameRequest request)
    {
        var game = gameRepository.UpdateGame(id, request);
        return Ok(game);
    }
}