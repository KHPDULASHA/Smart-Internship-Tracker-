using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipTrackerAPI.Models;

[Table("InternshipSkills")]
public class InternshipSkill
{
    public int InternshipId { get; set; }

    public int SkillId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Importance { get; set; } = "Required";

    public byte? TargetLevel { get; set; }

    [ForeignKey(nameof(InternshipId))]
    public Internship Internship { get; set; } = null!;

    [ForeignKey(nameof(SkillId))]
    public Skill Skill { get; set; } = null!;
}
