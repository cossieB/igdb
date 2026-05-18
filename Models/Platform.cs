using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Platform
{
    public int PlatformId { get; set; }

    public string Name { get; set; } = null!;

    public string Logo { get; set; } = null!;

    public DateOnly ReleaseDate { get; set; }

    public string Summary { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public virtual ICollection<Game> Games { get; set; } = new List<Game>();
}
