using System;

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
