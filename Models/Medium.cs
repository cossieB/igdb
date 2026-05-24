namespace igdb.Models;

public partial class Media
{
    public string Key { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public int? GameId { get; set; }

    public Dictionary<string, string> Metadata { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Game? Game { get; set; }

}


