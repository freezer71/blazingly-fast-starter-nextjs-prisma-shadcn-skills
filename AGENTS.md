# Project Structure & Process Summary

This project is a modern, blazingly fast full-stack SaaS starter built with Next.js 15, React 19, Prisma, and Shadcn UI.

## 🏗️ Architecture & Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Auth:** Better Auth (with Prisma adapter)
- **Database:** Prisma ORM with PostgreSQL
- **Styling:** Tailwind CSS 4 + Shadcn UI (OKLCH color space)
- **Forms:** React Hook Form + Zod
- **Emails:** Resend + React Email
- **Configuration:** Centralized metadata in `lib/metadata.ts`

## 📂 Key Directory Structure

```text
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── api/auth/         # Better Auth API routes
│   ├── login/            # Login page (with verification retry)
│   ├── register/         # Registration page
│   └── page.tsx          # Modern SaaS Landing Page
├── components/           # UI Components
│   ├── ui/               # Shadcn components
│   └── emails/           # React Email templates
├── lib/                  # Shared utilities & Config
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client instance
│   ├── metadata.ts       # Centralized site configuration
│   └── prisma.ts         # Prisma client instance
├── prisma/               # Database schema & migrations
└── public/               # Static assets (Logos, icons)
```

## 🔐 Authentication Flow (Email Verification)

We have implemented a secure verification flow:

1.  **Sign Up:** User registers via `/register`. Better Auth automatically generates a verification token.
2.  **Email Dispatch:** `lib/auth.ts` catches the `sendVerificationEmail` hook, renders a `VerificationEmail` (React Email), and sends it via **Resend**.
3.  **Restricted Access:** `requireEmailVerification: true` is enabled. Users cannot log in until verified.
4.  **Login Handling:** The `/login` page detects unverified status (403 error) and offers a "Resend verification email" button.
5.  **Success:** Once verified, the user is redirected and can access the protected parts of the application.

## ⚙️ Development Processes

### 1. Metadata Management
All site branding (Name, Logo, Description, Contact info) should be modified in `lib/metadata.ts`. This updates the SEO, the Landing Page, and the Email templates simultaneously.

### 2. Adding UI Components
Use the Shadcn CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```

### 3. Database Migrations
Every time you add or modify a field in `prisma/schema.prisma`, **you must create and apply a migration**:
```bash
npx prisma migrate dev --name your_migration_name
```
Alternatively, if you only need to update your local TypeScript types without a migration (e.g., after a git pull), run:
```bash
npx prisma generate
```
This command will:
1. Generate a new SQL migration file (for `migrate dev`).
2. Apply the changes to your local database (for `migrate dev`).
3. Re-generate the Prisma Client to reflect the new schema in your code.

If you make changes to authentication-related fields, remember to also re-run the Better Auth CLI if necessary: `npx @better-auth/cli@latest generate`.

### 4. Email Customization
Templates are located in `components/emails/`. Use the React Email syntax to modify layouts and styles.

### 5. Continuous Verification (Build Check)
... (existing content)

## 🛠️ Admin Dashboard
A protected admin dashboard is available at `/admin`.

### Features:
- **User Management:** List all users, change roles (Admin/User), and delete accounts.
- **Verification Status:** Monitor which users have verified their email.
- **System Stats:** Overview of total users, verified users, and admins.

### Access Control:
Access is restricted to users with the `role: "admin"` in the database.
To promote a user to admin manually for the first time, you can use the Prisma Studio or a database script.

## 🚀 Environment Variables Required
```env
# Database
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Resend
RESEND_API_KEY=
```
