using System;

namespace igdb.Dtos;

public class GenreDto
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }
}
