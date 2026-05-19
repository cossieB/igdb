using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace igdb.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Actor> Actors { get; set; }

    public virtual DbSet<Developer> Developers { get; set; }

    public virtual DbSet<Game> Games { get; set; }

    public virtual DbSet<GameActor> GameActors { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Medium> Media { get; set; }

    public virtual DbSet<Platform> Platforms { get; set; }

    public virtual DbSet<Publisher> Publishers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Database=gg;Username=postgres;Password=password;Port=5432", 
        o => o.MapEnum<RoleType>("role_type"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum<RoleType>("role_type");

        modelBuilder.Entity<Actor>(entity =>
        {
            entity.HasKey(e => e.ActorId).HasName("actors_pkey");

            entity.ToTable("actors");

            entity.Property(e => e.ActorId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("actor_id");
            entity.Property(e => e.Bio)
                .HasDefaultValueSql("''::text")
                .HasColumnName("bio");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.Photo).HasColumnName("photo");
        });

        modelBuilder.Entity<Developer>(entity =>
        {
            entity.HasKey(e => e.DeveloperId).HasName("developers_pkey");

            entity.ToTable("developers");

            entity.Property(e => e.DeveloperId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("developer_id");
            entity.Property(e => e.Country)
                .HasColumnType("character varying")
                .HasColumnName("country");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.Location)
                .HasColumnType("character varying")
                .HasColumnName("location");
            entity.Property(e => e.Logo).HasColumnName("logo");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.Summary)
                .HasDefaultValueSql("''::text")
                .HasColumnName("summary");
        });

        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.GameId).HasName("games_pkey");

            entity.ToTable("games");

            entity.HasIndex(e => e.DeveloperId, "games_developer_id_index");

            entity.HasIndex(e => e.PublisherId, "games_publisher_id_index");

            entity.HasIndex(e => e.SearchVector, "games_search_vector_index").HasMethod("gin");

            entity.Property(e => e.GameId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("game_id");
            entity.Property(e => e.Banner).HasColumnName("banner");
            entity.Property(e => e.Cover).HasColumnName("cover");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.DeveloperId).HasColumnName("developer_id");
            entity.Property(e => e.PublisherId).HasColumnName("publisher_id");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.SearchVector)
                .HasComputedColumnSql("(setweight(to_tsvector('english'::regconfig, (COALESCE(title, ''::character varying))::text), 'A'::\"char\") || setweight(to_tsvector('english'::regconfig, COALESCE(summary, ''::text)), 'B'::\"char\"))", true)
                .HasColumnName("search_vector");
            entity.Property(e => e.Summary)
                .HasDefaultValueSql("''::text")
                .HasColumnName("summary");
            entity.Property(e => e.Title)
                .HasColumnType("character varying")
                .HasColumnName("title");
            entity.Property(e => e.Trailer).HasColumnName("trailer");

            entity.HasOne(d => d.Developer).WithMany(p => p.Games)
                .HasForeignKey(d => d.DeveloperId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("games_developer_id_developers_developer_id_fkey");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Games)
                .HasForeignKey(d => d.PublisherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("games_publisher_id_publishers_publisher_id_fkey");

            entity.HasMany(d => d.Genres).WithMany(p => p.Games)
                .UsingEntity<Dictionary<string, object>>(
                    "GameGenre",
                    r => r.HasOne<Genre>().WithMany()
                        .HasForeignKey("Genre")
                        .HasConstraintName("game_genres_genre_genres_name_fkey"),
                    l => l.HasOne<Game>().WithMany()
                        .HasForeignKey("GameId")
                        .HasConstraintName("game_genres_game_id_games_game_id_fkey"),
                    j =>
                    {
                        j.HasKey("GameId", "Genre").HasName("game_tags_pkey");
                        j.ToTable("game_genres");
                        j.IndexerProperty<int>("GameId").HasColumnName("game_id");
                        j.IndexerProperty<string>("Genre")
                            .HasColumnType("character varying")
                            .HasColumnName("genre");
                    });

            entity.HasMany(d => d.Platforms).WithMany(p => p.Games)
                .UsingEntity<Dictionary<string, object>>(
                    "GamePlatform",
                    r => r.HasOne<Platform>().WithMany()
                        .HasForeignKey("PlatformId")
                        .HasConstraintName("game_platforms_platform_id_platforms_platform_id_fkey"),
                    l => l.HasOne<Game>().WithMany()
                        .HasForeignKey("GameId")
                        .HasConstraintName("game_platforms_game_id_games_game_id_fkey"),
                    j =>
                    {
                        j.HasKey("GameId", "PlatformId").HasName("game_platforms_pkey");
                        j.ToTable("game_platforms");
                        j.IndexerProperty<int>("GameId").HasColumnName("game_id");
                        j.IndexerProperty<int>("PlatformId").HasColumnName("platform_id");
                    });
        });

        modelBuilder.Entity<GameActor>(entity =>
        {
            entity.HasKey(e => e.AppearanceId).HasName("game_actors_pkey");

            entity.ToTable("game_actors");

            entity.HasIndex(e => new { e.GameId, e.ActorId }, "game_actors_game_id_actor_id_unique").IsUnique();

            entity.Property(e => e.AppearanceId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("appearance_id");
            entity.Property(e => e.ActorId).HasColumnName("actor_id");
            entity.Property(e => e.Character)
                .HasColumnType("character varying")
                .HasColumnName("character");
            entity.Property(e => e.GameId).HasColumnName("game_id");

            entity.HasOne(d => d.Actor).WithMany(p => p.GameActors)
                .HasForeignKey(d => d.ActorId)
                .HasConstraintName("game_actors_actor_id_actors_actor_id_fkey");

            entity.Property(e => e.RoleType)
                .HasColumnName("role_type");

            entity.HasOne(d => d.Game).WithMany(p => p.GameActors)
                .HasForeignKey(d => d.GameId)
                .HasConstraintName("game_actors_game_id_games_game_id_fkey");
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("tags_pkey");

            entity.ToTable("genres");

            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.Description)
                .HasDefaultValueSql("''::text")
                .HasColumnName("description");
        });

        modelBuilder.Entity<Medium>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("media_pkey");

            entity.ToTable("media");

            entity.HasIndex(e => new { e.PostId, e.GameId }, "media_post_id_game_id_index");

            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.ContentType)
                .HasColumnType("character varying")
                .HasColumnName("content_type");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.GameId).HasColumnName("game_id");
            entity.Property(e => e.Metadata)
                .HasDefaultValueSql("'{}'::jsonb")
                .HasColumnType("jsonb")
                .HasColumnName("metadata");
            entity.Property(e => e.PostId).HasColumnName("post_id");

            entity.HasOne(d => d.Game).WithMany(p => p.Media)
                .HasForeignKey(d => d.GameId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("media_game_id_games_game_id_fkey");
        });

        modelBuilder.Entity<Platform>(entity =>
        {
            entity.HasKey(e => e.PlatformId).HasName("platforms_pkey");

            entity.ToTable("platforms");

            entity.Property(e => e.PlatformId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("platform_id");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.Logo).HasColumnName("logo");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.Summary)
                .HasDefaultValueSql("''::text")
                .HasColumnName("summary");
        });

        modelBuilder.Entity<Publisher>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("publishers_pkey");

            entity.ToTable("publishers");

            entity.Property(e => e.PublisherId)
                .UseIdentityAlwaysColumn()
                .HasColumnName("publisher_id");
            entity.Property(e => e.Country)
                .HasColumnType("character varying")
                .HasColumnName("country");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("now()")
                .HasColumnName("date_added");
            entity.Property(e => e.DateModified).HasColumnName("date_modified");
            entity.Property(e => e.Headquarters)
                .HasColumnType("character varying")
                .HasColumnName("headquarters");
            entity.Property(e => e.Logo).HasColumnName("logo");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.Summary)
                .HasDefaultValueSql("''::text")
                .HasColumnName("summary");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
