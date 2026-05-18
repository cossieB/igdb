using System;
using System.Collections.Generic;

namespace igdb.Models;

public partial class Medium
{
    public string Key { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public int? PostId { get; set; }

    public int? GameId { get; set; }

    public string Metadata { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Game? Game { get; set; }

}
