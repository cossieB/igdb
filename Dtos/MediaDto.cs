using System;

namespace igdb.Dtos;

public class MediaDto
{
    public string Key { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public int? GameId { get; set; }

    public Dictionary<string, string> Metadata { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}

public class MediaRequest
{
    public string ContentType { get; set; } = null!;
    public string Key { get; set; } = null!;
    public string? Metadata {get; set;}
}