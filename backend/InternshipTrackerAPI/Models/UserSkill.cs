using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipTrackerAPI.Models;

[Table("UserSkills")]
public class UserSkill
{
    public Guid UserId { get; set; }

    public int SkillId { get; set; }

    public byte Level { get; set; }

    public DateOnly? LastPracticed { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [ForeignKey(nameof(SkillId))]
    public Skill Skill { get; set; } = null!;
}
