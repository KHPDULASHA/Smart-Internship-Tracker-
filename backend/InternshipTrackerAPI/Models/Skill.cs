using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipTrackerAPI.Models;

[Table("Skills")]
public class Skill
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int SkillId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Category { get; set; }

    public ICollection<InternshipSkill> InternshipSkills { get; set; } = new List<InternshipSkill>();

    public ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
