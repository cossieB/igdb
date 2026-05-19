using System;

namespace igdb.Dtos;

public class PlatformDto
{
    public int PlatformId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public DateOnly ReleaseDate { get; set; }

    public string Summary { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }
}
