using System.ComponentModel.DataAnnotations;
using System.Text.Json;
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
    [Authorize(Roles = "Admin")]
    [HttpPost]
    async public Task<IActionResult> AddGame(CreateGameRequest request)
    {
        try
        {
            var genres = await _dbContext.Genres.Where(g => request.Genres.Contains(g.Name)).ToListAsync();
            var platforms = await _dbContext.Platforms.Where(p => request.Platforms.Contains(p.PlatformId)).ToListAsync();

            var newGame = new Game
            {
                Title = request.Title,
                DeveloperId = request.DeveloperId,
                PublisherId = request.PublisherId,
                Banner = request.Banner,
                Cover = request.Cover,
                Trailer = request.Trailer,
                Summary = request.Summary,
                Genres = genres,
                Platforms = platforms,
                ReleaseDate = request.ReleaseDate,
            };
            var g = _dbContext.Games.Add(newGame);

            List<Media> media = [.. request.Media.Select(m => new Media
            {
                ContentType = m.ContentType,
                Game = newGame,
                Key = m.Key
            })];

            _dbContext.Media.AddRange(media);

            await _dbContext.SaveChangesAsync();

            return Created($"/games/{newGame.GameId}", newGame.Adapt<GameDto>());
        }
        catch (DbUpdateException e)
        {
            if (e.InnerException?.Message.Contains("foreign key constraint") == true)
            {
                return BadRequest(new {error = "Foreign key constraints failed"});
            }
            return Problem(e.InnerException?.Message ?? "Something went wrong. Please try again later");            
        }
        catch
        {
            return Problem("Something went wrong. Please try again later");
        }
    }


}