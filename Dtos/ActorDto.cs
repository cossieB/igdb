using System;
using System.ComponentModel.DataAnnotations;

namespace igdb.Dtos;

public class ActorDto
{
    public int ActorId { get; set; }

    public string Name { get; set; } = null!;

    public string? Photo { get; set; }

    public string Bio { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }    
}

public class ActorCreateDto
{
    [Required]
    public string Name {get; set;} = null!;
    public string? Photo {get; set;}
    public string Bio {get; set;} = string.Empty;

}

public class ActorUpdateDto
{
    public string? Name {get; set;}
    public string? Photo {get; set;}
    public string? Bio {get; set;}
}