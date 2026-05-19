using System;
using igdb.Models;

namespace igdb.Dtos;

public class RolesDto
{
    public int GameId { get; set; }

    public int ActorId { get; set; }

    public string Character { get; set; } = null!;

    public int AppearanceId { get; set; }

    public string RoleType {get; set;} = null!;
}
