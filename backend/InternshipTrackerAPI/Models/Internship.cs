using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipTrackerAPI.Models;

[Table("Internships")]
public class Internship
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int InternshipId { get; set; }

    public Guid UserId { get; set; }

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

    public DateTime CreatedAt { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public ICollection<InternshipSkill> InternshipSkills { get; set; } = new List<InternshipSkill>();
}
