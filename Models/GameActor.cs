using System;
using System.Collections.Generic;
using NpgsqlTypes;

namespace igdb.Models;

public partial class GameActor
{
    public int GameId { get; set; }

    public int ActorId { get; set; }

    public string Character { get; set; } = null!;

    public int AppearanceId { get; set; }
    public RoleType RoleType {get; set;}
    public virtual Actor Actor { get; set; } = null!;

    public virtual Game Game { get; set; } = null!;

}

public enum RoleType
{
    [PgName("player character")]
    PlayerCharacter,

    [PgName("major character")]
    MajorCharacter,

    [PgName("minor character")]
    MinorCharacter
}