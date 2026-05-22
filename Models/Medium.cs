using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace igdb.Models;

public partial class Media
{
    public string Key { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public int? GameId { get; set; }

    public string Metadata { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Game? Game { get; set; }

}

public class MediaRequest
{
    public string ContentType { get; set; } = null!;
    public string Key { get; set; } = null!;
}