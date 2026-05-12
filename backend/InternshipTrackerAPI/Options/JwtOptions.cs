namespace InternshipTrackerAPI.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    /// <summary>HMAC signing key (UTF-8). Use at least 32 bytes for HS256.</summary>
    public string SigningKey { get; set; } = string.Empty;
    public int AccessTokenExpirationMinutes { get; set; } = 60;
}
