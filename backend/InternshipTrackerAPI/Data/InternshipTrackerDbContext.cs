using InternshipTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipTrackerAPI.Data;

public class InternshipTrackerDbContext : DbContext
{
    public InternshipTrackerDbContext(DbContextOptions<InternshipTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Internship> Internships => Set<Internship>();
    public DbSet<Skill> Skills => Set<Skill>();
    public DbSet<InternshipSkill> InternshipSkills => Set<InternshipSkill>();
    public DbSet<UserSkill> UserSkills => Set<UserSkill>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Internship>(e =>
        {
            e.HasOne(i => i.User)
                .WithMany(u => u.Internships)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.Property(i => i.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("SYSUTCDATETIME()")
                .ValueGeneratedOnAdd();
            e.HasIndex(i => new { i.UserId, i.Status });
        });

        modelBuilder.Entity<Skill>(e =>
        {
            e.HasIndex(s => s.Name).IsUnique();
        });

        modelBuilder.Entity<InternshipSkill>(e =>
        {
            e.HasKey(x => new { x.InternshipId, x.SkillId });

            e.HasOne(x => x.Internship)
                .WithMany(i => i.InternshipSkills)
                .HasForeignKey(x => x.InternshipId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Skill)
                .WithMany(s => s.InternshipSkills)
                .HasForeignKey(x => x.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

            e.Property(x => x.Importance).HasMaxLength(20).HasDefaultValue("Required");
            e.HasIndex(x => x.SkillId);
        });

        modelBuilder.Entity<UserSkill>(e =>
        {
            e.HasKey(x => new { x.UserId, x.SkillId });

            e.HasOne(x => x.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Skill)
                .WithMany(s => s.UserSkills)
                .HasForeignKey(x => x.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => x.SkillId);
        });
    }
}
