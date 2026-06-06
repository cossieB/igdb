using System.Security.Claims;
using System.Threading.RateLimiting;
using igdb.Models;
using igdb.Repositories;
using igdb.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var RESEND_KEY = Environment.GetEnvironmentVariable("RESEND_KEY") ?? throw new InvalidOperationException("RESEND_KEY environment variable is missing");

var forwardedHeaderOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
// Clear known networks/proxies so it accepts headers from Cloudflare's IPs
forwardedHeaderOptions.KnownIPNetworks.Clear();
forwardedHeaderOptions.KnownProxies.Clear();

// Add services to the container.
builder.Services.AddScoped<GameRepository>();
builder.Services.AddScoped<ActorRepository>();
builder.Services.AddScoped<PlatformRepository>();
builder.Services.AddScoped<DeveloperRepository>();
builder.Services.AddScoped<PublisherRepository>();
builder.Services.AddScoped<ActorRolesRepository>();
builder.Services.AddSingleton((_) => ResendClient.Create(RESEND_KEY));
builder.Services.AddControllers();
builder.Services
    .AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorization();
builder.Services.AddIdentityCore<User>(options =>
{
    options.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, UserClaimsPrincipalFactory<User, IdentityRole>>();
builder.Services.AddOpenApi(options =>
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
{
    options.AddSchemaTransformer((schema, context, cancellationToken) =>
    {
        if (schema.Format == "int32")
        {
            // Force it to be a pure integer type and clear the string regex pattern
            schema.Type = Microsoft.OpenApi.JsonSchemaType.Integer;
            schema.Pattern = null;
        }
        return Task.CompletedTask;
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("UserLimitPolicy", httpContext =>
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null)
        {
            var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            return RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: ip,
                factory: _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromDays(1),
                    QueueLimit = 0
                }
            );
        }
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: userId,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 50,
                Window = TimeSpan.FromDays(1),
                QueueLimit = 0
            }
        );
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), npgsqlOptionsAction =>
    {
        npgsqlOptionsAction.ConfigureDataSource(ds => ds.EnableDynamicJson());
    }));

builder.Services.AddScoped<IMapper, Mapper>();
builder.Services.AddTransient<IEmailSender<User>, EmailService>();

var app = builder.Build();

// app.UseHttpsRedirection();
app.MapOpenApi();
app.MapScalarApiReference();
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<User>();
app.MapControllers();
app.UseRateLimiter();
app.Run();