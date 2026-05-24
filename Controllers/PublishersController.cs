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
public class PublishersController(PublisherRepository publisherRepository, GameRepository gameRepository) : ControllerBase
{    
    [ProducesResponseType(typeof(PublisherDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("{id:int:min(1)}")]
    async public Task<IActionResult> GetById(int id)
    {
        var dev = await publisherRepository.FindById(id);
        if (dev is null) return NotFound();
        return Ok(dev.Adapt<PublisherDto>());
    }
    
    [HttpGet]
    async public Task<ActionResult<List<PublisherDto>>> GetAll([FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var devs = await publisherRepository.FindAll(cursor, limit);
        return Ok(devs.Adapt<List<PublisherDto>>());
    }
    
    [HttpGet("{id:int:min(1)}/games")]
    async public Task<ActionResult<List<GameDto>>> GetGames(int id, [FromQuery] int cursor = 0, [FromQuery, Range(1, 20)] int limit = 10)
    {
        var games = await gameRepository.FindAll(cursor, limit, publisherId: id);
        return Ok(games.Adapt<List<GameDto>>());
    }

    [HttpPost]
    async public Task<ActionResult<PublisherDto>> AddPublisher(PublisherCreateDto dto)
    {
        var publisher = await publisherRepository.CreatePublisher(dto);
        return Created($"/publishers/{publisher.PublisherId}", publisher);
    }

    [HttpPatch("{id:int:min(1)}")]
    async public Task<IActionResult> UpdatePublisher(int id, PublisherUpdateDto dto)
    {
        var publisher = await publisherRepository.UpdatePublisher(id, dto);
        if (publisher is null) return NotFound();
        return Ok(publisher);
    }
}