using System;
using System.ComponentModel.DataAnnotations;

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

public class PlatformCreateDto
{   
    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Logo { get; set; } = null!;

    [Required]
    public DateOnly ReleaseDate { get; set; }

    [Required]
    public string Summary { get; set; } = null!;    
}

public class PlatformUpdateDto
{
    public string? Name { get; set; }

    public string? Logo { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public string? Summary { get; set; }    
}