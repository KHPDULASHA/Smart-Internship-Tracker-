using System.Security.Claims;
using InternshipTrackerAPI.Data;
using InternshipTrackerAPI.Dtos;
using InternshipTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipTrackerAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/users/{userId:guid}/internships")]
public class InternshipsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public InternshipsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private bool CallerOwnsUser(Guid userId)
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return sub is not null && Guid.TryParse(sub, out var callerId) && callerId == userId;
    }

    /// <summary>List all internships for a user.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<InternshipReadDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InternshipReadDto>>> GetAll(Guid userId, CancellationToken cancellationToken)
    {
        if (!CallerOwnsUser(userId))
            return Forbid();
        if (!await UserExistsAsync(userId, cancellationToken))
            return NotFound("User not found.");

        var items = await _db.Internships
            .AsNoTracking()
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new InternshipReadDto
            {
                InternshipId = i.InternshipId,
                UserId = i.UserId,
                CompanyName = i.CompanyName,
                Title = i.Title,
                Link = i.Link,
                Status = i.Status,
                DeadlineDate = i.DeadlineDate,
                AppliedDate = i.AppliedDate,
                Notes = i.Notes,
                CreatedAt = i.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    /// <summary>Get a single internship by id (must belong to the user).</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(InternshipReadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InternshipReadDto>> GetById(Guid userId, int id, CancellationToken cancellationToken)
    {
        if (!CallerOwnsUser(userId))
            return Forbid();
        var dto = await _db.Internships
            .AsNoTracking()
            .Where(i => i.InternshipId == id && i.UserId == userId)
            .Select(i => new InternshipReadDto
            {
                InternshipId = i.InternshipId,
                UserId = i.UserId,
                CompanyName = i.CompanyName,
                Title = i.Title,
                Link = i.Link,
                Status = i.Status,
                DeadlineDate = i.DeadlineDate,
                AppliedDate = i.AppliedDate,
                Notes = i.Notes,
                CreatedAt = i.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (dto is null)
            return NotFound();

        return Ok(dto);
    }

    /// <summary>Create an internship for the user.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(InternshipReadDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InternshipReadDto>> Create(Guid userId, [FromBody] InternshipCreateDto dto, CancellationToken cancellationToken)
    {
        if (!CallerOwnsUser(userId))
            return Forbid();
        if (!await UserExistsAsync(userId, cancellationToken))
            return NotFound("User not found.");

        var entity = new Internship
        {
            UserId = userId,
            CompanyName = dto.CompanyName,
            Title = dto.Title,
            Link = dto.Link,
            Status = dto.Status,
            DeadlineDate = dto.DeadlineDate,
            AppliedDate = dto.AppliedDate,
            Notes = dto.Notes
        };

        _db.Internships.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        await _db.Entry(entity).ReloadAsync(cancellationToken);
        var read = new InternshipReadDto
        {
            InternshipId = entity.InternshipId,
            UserId = entity.UserId,
            CompanyName = entity.CompanyName,
            Title = entity.Title,
            Link = entity.Link,
            Status = entity.Status,
            DeadlineDate = entity.DeadlineDate,
            AppliedDate = entity.AppliedDate,
            Notes = entity.Notes,
            CreatedAt = entity.CreatedAt
        };
        return CreatedAtAction(nameof(GetById), new { userId, id = entity.InternshipId }, read);
    }

    /// <summary>Update an internship.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid userId, int id, [FromBody] InternshipUpdateDto dto, CancellationToken cancellationToken)
    {
        if (!CallerOwnsUser(userId))
            return Forbid();
        var entity = await _db.Internships.FirstOrDefaultAsync(i => i.InternshipId == id && i.UserId == userId, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.CompanyName = dto.CompanyName;
        entity.Title = dto.Title;
        entity.Link = dto.Link;
        entity.Status = dto.Status;
        entity.DeadlineDate = dto.DeadlineDate;
        entity.AppliedDate = dto.AppliedDate;
        entity.Notes = dto.Notes;

        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    /// <summary>Delete an internship (cascades internship skills).</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid userId, int id, CancellationToken cancellationToken)
    {
        if (!CallerOwnsUser(userId))
            return Forbid();
        var entity = await _db.Internships.FirstOrDefaultAsync(i => i.InternshipId == id && i.UserId == userId, cancellationToken);
        if (entity is null)
            return NotFound();

        _db.Internships.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private Task<bool> UserExistsAsync(Guid userId, CancellationToken cancellationToken) =>
        _db.Users.AnyAsync(u => u.UserId == userId, cancellationToken);
}
