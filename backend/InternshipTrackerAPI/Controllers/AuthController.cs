using InternshipTrackerAPI.Data;
using InternshipTrackerAPI.Dtos;
using InternshipTrackerAPI.Models;
using InternshipTrackerAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        ApplicationDbContext db,
        IPasswordHasher<User> passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    /// <summary>Register a new user and receive a JWT.</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(u => u.Email == email, cancellationToken);
        if (exists)
            return Conflict(new { message = "An account with this email already exists." });

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = email
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(BuildAuthResponse(user));
    }

    /// <summary>Log in and receive a JWT.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        if (user?.PasswordHash is null)
            return Unauthorized(new { message = "Invalid email or password." });

        var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid email or password." });

        if (verify == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            await _db.SaveChangesAsync(cancellationToken);
        }

        return Ok(BuildAuthResponse(user));
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var utcNow = DateTime.UtcNow;
        var token = _jwtTokenService.CreateAccessToken(user, utcNow, out var expiresAtUtc);
        return new AuthResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            UserId = user.UserId,
            Email = user.Email
        };
    }
}
