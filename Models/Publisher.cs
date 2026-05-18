using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Publisher
{
    public int PublisherId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public string? Headquarters { get; set; }

    public string Summary { get; set; } = null!;

    public string? Country { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public virtual ICollection<Game> Games { get; set; } = new List<Game>();
}
