using System;
using System.ComponentModel.DataAnnotations;

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

public class DeveloperCreateDto
{
    [Required]
    public string Name { get; set; } = null!;
    [Required]
    public string Logo { get; set; } = null!;
    public string Summary { get; set; } = string.Empty;
    [Required]
    public string Location { get; set; } = null!;
    [Required]
    public string Country { get; set; } = null!;
}
public class DeveloperUpdateDto
{
    public string? Name { get; set; }
    public string? Logo { get; set; }
    public string? Summary { get; set; }
    public string? Location { get; set; }
    public string? Country { get; set; }
}