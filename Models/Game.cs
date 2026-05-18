using System;
using System.Collections.Generic;
using NpgsqlTypes;

namespace igdb.Models;

public partial class Game
{
    public int GameId { get; set; }

    public string Title { get; set; } = null!;

    public string Summary { get; set; } = null!;

    public int DeveloperId { get; set; }

    public int PublisherId { get; set; }

    public DateOnly ReleaseDate { get; set; }

    public string Cover { get; set; } = null!;

    public string Banner { get; set; } = null!;

    public string? Trailer { get; set; }

    public DateTime DateAdded { get; set; }

    public DateTime DateModified { get; set; }

    public NpgsqlTsVector? SearchVector { get; set; }

    public virtual Developer Developer { get; set; } = null!;

    public virtual ICollection<GameActor> GameActors { get; set; } = new List<GameActor>();

    public virtual ICollection<Medium> Media { get; set; } = new List<Medium>();

    public virtual Publisher Publisher { get; set; } = null!;

    public virtual ICollection<Genre> Genres { get; set; } = new List<Genre>();

    public virtual ICollection<Platform> Platforms { get; set; } = new List<Platform>();
}
