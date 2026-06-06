using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using igdb.Dtos;
using igdb.Models;
using igdb.Repositories;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace igdb.Controllers;

[ApiController]
// [Authorize]
[EnableRateLimiting("UserLimitPolicy")]
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

    [Authorize(Roles = "Admin"), DisableRateLimiting]
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
    [Authorize(Roles = "Admin"), DisableRateLimiting]
    [HttpPatch("{id}")]
    async public Task<IActionResult> UpdateGame(int id, UpdateGameRequest request)
    {
        var game = gameRepository.UpdateGame(id, request);
        return Ok(game);
    }
}