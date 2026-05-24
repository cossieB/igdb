using System;
using System.ComponentModel.DataAnnotations;

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

public class PublisherCreateDto
{
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Logo { get; set; } = null!;
    public string? Headquarters { get; set; }
    [Required]
    public string Summary { get; set; } = null!;
    [Required]
    public string Country { get; set; } = null!;
}

public class PublisherUpdateDto
{
    public string? Name { get; set; }

    public string? Logo { get; set; }

    public string? Headquarters { get; set; }

    public string? Summary { get; set; }

    public string? Country { get; set; }    
}