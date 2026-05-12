using System.ComponentModel.DataAnnotations;

namespace InternshipTrackerAPI.Dtos;

public class InternshipReadDto
{
    public int InternshipId { get; set; }
    public Guid UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateOnly? DeadlineDate { get; set; }
    public DateOnly? AppliedDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class InternshipCreateDto
{
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Link { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public DateOnly? DeadlineDate { get; set; }
    public DateOnly? AppliedDate { get; set; }
    public string? Notes { get; set; }
}

public class InternshipUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Link { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public DateOnly? DeadlineDate { get; set; }
    public DateOnly? AppliedDate { get; set; }
    public string? Notes { get; set; }
}
