using System;

namespace igdb.Dtos;

public class PublisherDto
{
    public int PublisherId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public string? Headquarters { get; set; }

    public string Summary { get; set; } = null!;

    public string? Country { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }
}
