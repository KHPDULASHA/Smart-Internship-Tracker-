using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using InternshipTrackerAPI.Models;
using InternshipTrackerAPI.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace InternshipTrackerAPI.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions _options;

    public JwtTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string CreateAccessToken(User user, DateTime utcNow, out DateTime expiresAtUtc)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.SigningKey);
        if (keyBytes.Length < 32)
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 UTF-8 bytes for HS256.");

        var signingKey = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        expiresAtUtc = utcNow.AddMinutes(_options.AccessTokenExpirationMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: utcNow,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
