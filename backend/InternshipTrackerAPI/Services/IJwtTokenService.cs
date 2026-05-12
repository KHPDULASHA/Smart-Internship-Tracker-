using InternshipTrackerAPI.Models;

namespace InternshipTrackerAPI.Services;

public interface IJwtTokenService
{
    string CreateAccessToken(User user, DateTime utcNow, out DateTime expiresAtUtc);
}
