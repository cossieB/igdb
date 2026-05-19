using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Actor
{
    public int ActorId { get; set; }

    public string Name { get; set; } = null!;

    public string? Photo { get; set; }

    public string Bio { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public virtual ICollection<GameActor> GameActors { get; set; } = [];
}
