using System;
using System.ComponentModel.DataAnnotations;

namespace igdb.Dtos;

public class GameDto
{
    public int GameId { get; set; }
    public string Title { get; set; } = null!;
    public string Summary { get; set; } = null!;
    public int DeveloperId { get; set; }
    public int PublisherId { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public string Cover { get; set; } = null!;
    public string Banner { get; set; } = null!;
    public string? Trailer { get; set; }
    public DateTime DateAdded { get; set; }
    public DateTime DateModified { get; set; }
}

public class CreateGameRequest
{
    [Required, MinLength(1)]
    public string Title {get; set;} = null!;
    [Required, MinLength(1)]
    public string Banner {get; set;} = null!;
    [Required, MinLength(1)]
    public string Cover {get; set;} = null!;
    public string Summary {get; set;} = string.Empty;
    [Required, Url]
    public string Trailer {get; set;} = null!;
    [Required, Range(1, int.MaxValue)]
    public int DeveloperId {get; set;}
    [Required, Range(1, int.MaxValue)]
    public int PublisherId {get; set;}
    public List<string> Genres {get; set;} = [];
    public List<MediaRequest> Media {get; set;} = []; 
    [Required, MinLength(1)]
    public List<int> Platforms {get; set;} = [];
    public DateOnly ReleaseDate {get; set;}
}

public class UpdateGameRequest
{
    public string? Title {get; set;}
    public string? Banner {get; set;}
    [MinLength(1)]
    public string? Cover {get; set;}
    public string? Summary {get; set;}
    [Url]
    public string? Trailer {get; set;}
    [Range(1, int.MaxValue)]
    public int? DeveloperId {get; set;}
    [Range(1, int.MaxValue)]
    public int? PublisherId {get; set;}
    public List<string>? Genres {get; set;}
    public List<MediaRequest>? Media {get; set;}
    [MinLength(1)]
    public List<int>? Platforms {get; set;}
    public DateOnly? ReleaseDate {get; set;}    
}

class GameDetail : GameDto
{
    public PublisherDto Publisher {get; set;} = null!;
    public DeveloperDto Developer {get; set;} = null!;
    public List<PlatformDto> Platforms {get; set;} = [];
    public List<GenreDto> Genres {get; set;} = [];
    public List<ActorDto> Actors {get; set;} = [];
}
