using System;

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
