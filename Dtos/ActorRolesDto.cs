namespace igdb.Dtos;

public class ActorRolesDto
{
    public int GameId { get; set; }

    public int ActorId { get; set; }

    public string Character { get; set; } = null!;

    public int AppearanceId { get; set; }

    public string RoleType {get; set;} = null!;
}
