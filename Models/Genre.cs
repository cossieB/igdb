using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Genre
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public virtual ICollection<Game> Games { get; set; } = [];
}
