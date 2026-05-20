using igdb.Models;
using igdb.Services;
using MapsterMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Resend;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
var RESEND_KEY = Environment.GetEnvironmentVariable("RESEND_KEY") ?? throw new InvalidOperationException("RESEND_KEY environment variable is missing");

// Add services to the container.
builder.Services.AddSingleton((_) => ResendClient.Create(RESEND_KEY));
builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme).AddBearerToken(IdentityConstants.BearerScheme);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddSchemaTransformer((schema, context, cancellationToken) =>
    {
        // Check if the format is int32
        if (schema.Format == "int32")
        {
            // Force it to be a pure integer type and clear the string regex pattern
            schema.Type = Microsoft.OpenApi.JsonSchemaType.Integer;
            schema.Pattern = null; 
        }
        return Task.CompletedTask;
    });
});

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddApiEndpoints()
    .AddDefaultTokenProviders();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IMapper, Mapper>();
builder.Services.AddTransient<IEmailSender<User>, EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<User>();
app.MapControllers();
app.Run();
