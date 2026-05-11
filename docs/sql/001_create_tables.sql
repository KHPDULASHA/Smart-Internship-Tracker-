-- Smart Internship Tracker (SQL Server)
-- Initial schema: Users, Internships, Skills, InternshipSkills, UserSkills
-- Run in the target database (SSMS).

SET NOCOUNT ON;

-- Create schema if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'dbo')
BEGIN
    EXEC('CREATE SCHEMA dbo');
END
GO

-- USERS
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
        Email NVARCHAR(256) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
        PasswordHash NVARCHAR(512) NULL,
        CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSUTCDATETIME())
    );
END
GO

-- INTERNSHIPS (applications tracked by a user)
IF OBJECT_ID('dbo.Internships', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Internships (
        InternshipId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Internships PRIMARY KEY,
        UserId UNIQUEIDENTIFIER NOT NULL,
        CompanyName NVARCHAR(200) NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Link NVARCHAR(1000) NULL,
        Status NVARCHAR(50) NOT NULL,
        DeadlineDate DATE NULL,
        AppliedDate DATE NULL,
        Notes NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Internships_CreatedAt DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT FK_Internships_Users
            FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
            ON DELETE CASCADE
    );
END
GO

-- SKILLS (taxonomy)
IF OBJECT_ID('dbo.Skills', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Skills (
        SkillId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Skills PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL CONSTRAINT UQ_Skills_Name UNIQUE,
        Category NVARCHAR(100) NULL
    );
END
GO

-- INTERNSHIP SKILL REQUIREMENTS (many-to-many)
IF OBJECT_ID('dbo.InternshipSkills', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.InternshipSkills (
        InternshipId INT NOT NULL,
        SkillId INT NOT NULL,
        Importance NVARCHAR(20) NOT NULL CONSTRAINT DF_InternshipSkills_Importance DEFAULT ('Required'),
        TargetLevel TINYINT NULL,
        CONSTRAINT PK_InternshipSkills PRIMARY KEY (InternshipId, SkillId),
        CONSTRAINT FK_InternshipSkills_Internships
            FOREIGN KEY (InternshipId) REFERENCES dbo.Internships(InternshipId)
            ON DELETE CASCADE,
        CONSTRAINT FK_InternshipSkills_Skills
            FOREIGN KEY (SkillId) REFERENCES dbo.Skills(SkillId)
            ON DELETE CASCADE,
        CONSTRAINT CK_InternshipSkills_Importance
            CHECK (Importance IN ('Required','Nice')),
        CONSTRAINT CK_InternshipSkills_TargetLevel
            CHECK (TargetLevel IS NULL OR (TargetLevel >= 0 AND TargetLevel <= 5))
    );
END
GO

-- USER SKILLS (many-to-many with level)
IF OBJECT_ID('dbo.UserSkills', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.UserSkills (
        UserId UNIQUEIDENTIFIER NOT NULL,
        SkillId INT NOT NULL,
        Level TINYINT NOT NULL,
        LastPracticed DATE NULL,
        CONSTRAINT PK_UserSkills PRIMARY KEY (UserId, SkillId),
        CONSTRAINT FK_UserSkills_Users
            FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
            ON DELETE CASCADE,
        CONSTRAINT FK_UserSkills_Skills
            FOREIGN KEY (SkillId) REFERENCES dbo.Skills(SkillId)
            ON DELETE CASCADE,
        CONSTRAINT CK_UserSkills_Level
            CHECK (Level >= 0 AND Level <= 5)
    );
END
GO

-- Helpful indexes
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Internships_UserId_Status' AND object_id = OBJECT_ID('dbo.Internships'))
    CREATE INDEX IX_Internships_UserId_Status ON dbo.Internships(UserId, Status);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_UserSkills_SkillId' AND object_id = OBJECT_ID('dbo.UserSkills'))
    CREATE INDEX IX_UserSkills_SkillId ON dbo.UserSkills(SkillId);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_InternshipSkills_SkillId' AND object_id = OBJECT_ID('dbo.InternshipSkills'))
    CREATE INDEX IX_InternshipSkills_SkillId ON dbo.InternshipSkills(SkillId);
GO

