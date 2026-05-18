using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Developer
{
    public int DeveloperId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public string? Location { get; set; }

    public string Summary { get; set; } = null!;

    public string? Country { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public virtual ICollection<Game> Games { get; set; } = [];
}
