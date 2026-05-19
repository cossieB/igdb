using System;

namespace igdb.Dtos;

public class DeveloperDto
{
    public int DeveloperId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public string? Location { get; set; }

    public string Summary { get; set; } = null!;

    public string? Country { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }
}
