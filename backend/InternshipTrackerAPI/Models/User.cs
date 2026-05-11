using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipTrackerAPI.Models;

[Table("Users")]
public class User
{
    [Key]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(512)]
    public string? PasswordHash { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<Internship> Internships { get; set; } = new List<Internship>();

    public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
