using System.Text;
using InternshipTrackerAPI.Models;
using InternshipTrackerAPI.Options;
using InternshipTrackerAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace InternshipTrackerAPI.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInternshipTrackerJwt(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is required.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience is required.");
        var signingKey = jwtSection["SigningKey"] ?? throw new InvalidOperationException("Jwt:SigningKey is required.");
        if (Encoding.UTF8.GetBytes(signingKey).Length < 32)
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 UTF-8 bytes for HS256.");

        services.AddSingleton<IJwtTokenService, JwtTokenService>();
        services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
            });

        services.AddAuthorization();
        return services;
    }
}
