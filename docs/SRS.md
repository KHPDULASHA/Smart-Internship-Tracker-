# Software Requirements Specification (SRS)
## Smart Internship Tracker

**Version**: 1.0  
**Date**: 2026-05-11  
**Target Stack**: ASP.NET Core Web API, React (TypeScript), SQL Server

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional and non-functional requirements for the **Smart Internship Tracker**, a web application that helps students manage internship applications in one place, avoid missed deadlines, track application progress, and understand skill gaps for specific roles.

### 1.2 Scope
The system provides:
- A **personal dashboard** for internship applications and upcoming deadlines.
- **Application lifecycle tracking** (wishlist → applied → OA → interview → offer/reject).
- **Role skill requirements** and a computed **skill-gap view** based on the student’s skill profile.
- **In-app reminders** for deadlines and next steps.

Out of scope for the MVP (can be future enhancements):
- Email/SMS/push notifications
- Automatic scraping of job postings
- Resume/cover-letter versioning and file uploads
- Multi-tenant admin portal for universities

### 1.3 Definitions, Acronyms, Abbreviations
- **OA**: Online Assessment  
- **JWT**: JSON Web Token  
- **MVP**: Minimum Viable Product  
- **RBAC**: Role-Based Access Control  
- **PII**: Personally Identifiable Information

### 1.4 Intended Audience
- Students (end users)
- Product owner / supervisor (stakeholders)
- Developers and testers (implementation team)

---

## 2. Overall Description

### 2.1 Product Perspective
Smart Internship Tracker is a standalone web system with:
- React SPA frontend
- ASP.NET Core REST API backend
- SQL Server relational database

### 2.2 Product Functions (High Level)
- User registration and login
- Create, update, and search internship applications
- View deadlines, next steps, and status summaries
- Maintain a personal skill profile
- Define skill requirements per role and compute gaps
- Create reminders and surface due reminders on the dashboard

### 2.3 User Classes and Characteristics
- **Student (Authenticated User)**: Creates and manages their own applications, skills, and reminders.

### 2.4 Operating Environment
- **Client**: Modern browsers (Chrome/Edge/Firefox) on desktop; responsive UI for mobile.
- **Server**: Windows or Linux hosting for ASP.NET Core.
- **Database**: Microsoft SQL Server (local or hosted).

### 2.5 Design and Implementation Constraints
- Backend must be **ASP.NET Core Web API** using **EF Core**.
- Frontend must be **React + TypeScript**.
- Database must be **SQL Server**.
- Authentication must use **ASP.NET Core Identity + JWT** (MVP).

### 2.6 Assumptions and Dependencies
- Users have internet access and a supported browser.
- The system stores user-entered data only (MVP).
- Any background reminder processing runs inside the API host (MVP); advanced schedulers can be added later.

---

## 3. System Features and Functional Requirements

> Notation: Each requirement is labeled **FR-xx**. “Shall” indicates a mandatory requirement.

### 3.1 Authentication and Account Management

- **FR-01 Registration**: The system shall allow a user to register using email/username and password.
- **FR-02 Login**: The system shall allow a user to log in and receive a JWT access token.
- **FR-03 Authorization**: The system shall protect all application, skills, and reminders endpoints so only authenticated users can access them.
- **FR-04 Data isolation**: The system shall ensure a user can only access and modify their own records (applications, events, skills, reminders).
- **FR-05 Logout**: The system shall allow the user to log out (client-side token removal) and invalidate refresh tokens if refresh tokens are implemented.

### 3.2 Application Tracking

- **FR-06 Create application**: The system shall allow a user to create an internship application record including at least company, role title, application link, status, and optional notes.
- **FR-07 Update application**: The system shall allow a user to update an application’s status, deadline date, next step date, priority, and notes.
- **FR-08 View application details**: The system shall display application details including timeline/events, reminders, and skill requirements.
- **FR-09 List applications**: The system shall list all applications for the authenticated user.
- **FR-10 Filter and search**: The system shall support filtering applications by status and searching by company name and role title.
- **FR-11 Sort**: The system shall support sorting by deadline date and priority.
- **FR-12 Status pipeline**: The system shall support at minimum the statuses: Wishlist, Applied, OA, Interview, Offer, Rejected, Withdrawn.

### 3.3 Application Timeline / Events

- **FR-13 Add event**: The system shall allow a user to add events to an application (e.g., OA scheduled, interview round, offer received) with date and notes.
- **FR-14 View events**: The system shall display events in reverse chronological order and as a timeline view in the UI.

### 3.4 Deadlines, Next Steps, and Dashboard

- **FR-15 Dashboard summary**: The system shall show counts of applications grouped by status.
- **FR-16 Upcoming deadlines**: The system shall show a list of upcoming deadlines within a configurable window (default: next 14 days).
- **FR-17 Next steps**: The system shall show a list of upcoming next-step dates (e.g., follow-up date).
- **FR-18 At-risk detection**: The system shall mark applications as “at risk” when a deadline is within a configurable threshold (default: 7 days) and the status is not Applied or later (e.g., Wishlist).

### 3.5 Skills Profile

- **FR-19 Skills taxonomy**: The system shall provide a set of skills (e.g., DSA, React, SQL, Cloud) that can be assigned to users and roles.
- **FR-20 Maintain user skills**: The system shall allow a user to add/update their own skill level (0–5) and optional “last practiced” date.
- **FR-21 Skill categories**: The system shall group skills into categories for easier navigation (e.g., Programming, Web, Databases, Cloud, ML).

### 3.6 Role Skill Requirements and Skill Gap

- **FR-22 Define role requirements**: The system shall allow the user to define required/nice-to-have skills for an application’s role with target level.
- **FR-23 Compute skill gap**: The system shall compute skill gaps for an application by comparing role requirements with the user’s skills.
- **FR-24 Gap results**: The system shall present gap results separated into (a) missing skills and (b) below-target skills.

### 3.7 Reminders (In-App)

- **FR-25 Create reminder**: The system shall allow a user to create an in-app reminder for an application at a specific date/time.
- **FR-26 Due reminders**: The system shall show due reminders on the dashboard and/or an alerts panel.
- **FR-27 Mark reminder handled**: The system shall allow a user to mark a reminder as dismissed/completed.

---

## 4. External Interface Requirements

### 4.1 User Interface (UI)
- Responsive layout for desktop and mobile.
- Pages (minimum):
  - Login/Register
  - Dashboard
  - Applications List
  - Application Detail (with events, reminders, skill gap)
  - Skills Profile

### 4.2 API Interface
- RESTful JSON API over HTTPS.
- Versioned endpoints (recommended): `/api/v1/...`
- Swagger/OpenAPI documentation available in non-production environments.
- Bearer token auth: `Authorization: Bearer <token>`

### 4.3 Database Interface
- SQL Server accessed via EF Core.
- Migrations used to create/update schema.

---

## 5. Data Requirements

### 5.1 Core Entities (Conceptual)
- **User**: identity, credentials (via ASP.NET Core Identity).
- **Company**: name, website, notes.
- **InternshipRole**: companyId, title, location/workMode, season, link.
- **Application**: userId, roleId, status, appliedDate, deadlineDate, nextStepDate, priority, source, notes.
- **ApplicationEvent**: applicationId, type, date, notes.
- **Skill**: name, category.
- **UserSkill**: userId, skillId, level (0–5), lastPracticed.
- **RoleSkillRequirement**: roleId/applicationRoleId, skillId, importance (Required/Nice), targetLevel.
- **Reminder**: applicationId, remindAt, state (Pending/Dismissed), handledAt.

### 5.2 Data Validation Rules (Minimum)
- Email must be valid format; password must meet configured complexity policy.
- Status must be one of the allowed enum values.
- Skill level must be within 0–5.
- Deadline date cannot be earlier than application creation date (if provided).
- A reminder time must be a valid timestamp and associated with an application owned by the user.

### 5.3 Data Retention
- User may delete an application; related events/reminders/requirements shall be deleted or orphan-safe per configured cascade behavior.
- Audit logging is optional for MVP.

---

## 6. Non-Functional Requirements

### 6.1 Security
- **NFR-01 HTTPS**: The system shall use HTTPS in production.
- **NFR-02 Password storage**: Passwords shall be stored only via ASP.NET Core Identity hashing (no plain text).
- **NFR-03 Authorization**: All user data access shall be authorized and scoped to the authenticated user.
- **NFR-04 Input validation**: The API shall validate inputs and prevent overposting (DTO-based).
- **NFR-05 OWASP basics**: The system shall mitigate common risks (SQL injection via parameterized ORM, XSS via React escaping, CSRF considerations depending on token storage strategy).

### 6.2 Performance
- **NFR-06 Response time**: For typical usage, list and dashboard endpoints should respond within 2 seconds under normal load.
- **NFR-07 Pagination**: Applications list shall support pagination for scalability.

### 6.3 Reliability and Availability
- **NFR-08 Data integrity**: Database operations shall be transactional where needed (e.g., application + events).
- **NFR-09 Error handling**: API shall return consistent error responses (problem details recommended).

### 6.4 Usability
- **NFR-10 Minimal friction**: Common flows (add application, change status, set deadline) should be possible in under 1 minute.
- **NFR-11 Accessibility**: UI should follow basic WCAG practices (keyboard navigation, labels, contrast).

### 6.5 Maintainability
- **NFR-12 Layering**: Code shall be organized into API/Domain/Infrastructure layers with clear boundaries.
- **NFR-13 Automated tests**: Include automated tests for critical API flows (auth + core CRUD) as feasible.

### 6.6 Portability
- **NFR-14 Deployment**: System shall be deployable on Windows or Linux with SQL Server connection configuration via environment variables.

---

## 7. Suggested User Stories (Derived from Requirements)
- As a student, I want to add applications with deadlines so I don’t miss them.
- As a student, I want to update my application status so I know where I stand.
- As a student, I want to see upcoming deadlines/next steps on a dashboard so I can prioritize.
- As a student, I want to record my current skills so I know my strengths.
- As a student, I want to see missing skills for a role so I can plan learning.
- As a student, I want reminders so I remember to apply/follow up.

---

## 8. Acceptance Criteria (MVP)
- A user can register and log in; protected endpoints reject unauthenticated requests.
- A user can create, view, update, and list applications; cannot access other users’ data.
- Dashboard shows status counts and upcoming deadlines; “at-risk” labeling works per rules.
- A user can define skill levels; define role requirements; skill-gap output is correct for missing and below-target skills.
- A user can create reminders and see due reminders; can dismiss/complete reminders.

