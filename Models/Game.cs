using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using NpgsqlTypes;

namespace igdb.Models;

public partial class Game
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

    public NpgsqlTsVector? SearchVector { get; set; }

    public virtual Developer Developer { get; set; } = null!;

    public virtual ICollection<GameActor> GameActors { get; set; } = [];

    public virtual ICollection<Media> Media { get; set; } = [];
    public virtual Publisher Publisher { get; set; } = null!;

    public virtual ICollection<Genre> Genres { get; set; } = [];

    public virtual ICollection<Platform> Platforms { get; set; } = [];
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