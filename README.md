# Online Quiz Platform

A modern, full-stack quiz application built with Next.js, TypeScript, and Prisma.

🌐 **Live Demo:** [online-quiz-platform-rosy.vercel.app](https://online-quiz-platform-rosy.vercel.app)

## Features

- User authentication and authorization
- Create and manage quizzes with multiple question types
- Take quizzes with real-time scoring
- Track progress and view quiz history
- Leaderboards and analytics
- Responsive design for all devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL/MySQL** - Database
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Prerequisites

- Node.js (v18+)
- npm/yarn/pnpm/bun
- PostgreSQL or MySQL

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/deepaklabade/online-quiz-platform.git
cd online-quiz-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_platform"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Email
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@quizplatform.com
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Database Setup

**Local PostgreSQL:**

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE quiz_platform;
CREATE USER quizuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quiz_platform TO quizuser;
\q
```

**Cloud Database (Recommended):**
- [Supabase](https://supabase.com) - PostgreSQL
- [Railway](https://railway.app) - PostgreSQL
- [PlanetScale](https://planetscale.com) - MySQL

### 5. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed data
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linting

npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev   # Run migrations
```

## Project Structure

```
online-quiz-platform/
├── prisma/              # Database schema & migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── (auth)/      # Auth pages
│   │   └── quizzes/     # Quiz pages
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── quiz/        # Quiz components
│   └── lib/             # Utilities
├── .env                 # Environment variables
├── next.config.ts       # Next.js config
└── package.json
```

## API Routes

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Quizzes:**
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/[id]` - Get quiz by ID
- `POST /api/quizzes` - Create quiz
- `PUT /api/quizzes/[id]` - Update quiz
- `DELETE /api/quizzes/[id]` - Delete quiz

**Results:**
- `POST /api/results` - Submit quiz results
- `GET /api/results/user/[userId]` - User history
- `GET /api/results/quiz/[quizId]` - Leaderboard

## Troubleshooting

**Prisma Client not generated:**
```bash
npx prisma generate
```

**Database connection failed:**
- Check `DATABASE_URL` in `.env`
- Ensure database is running

**Port already in use:**
```bash
PORT=3001 npm run dev
```

**Migration failed:**
```bash
npx prisma migrate reset
npx prisma migrate dev
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

For production, use a managed database (Supabase, Railway, or PlanetScale).

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/name`
5. Open Pull Request

## License

MIT License

## Acknowledgments

Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [shadcn/ui](https://ui.shadcn.com/), and [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by [Deepak Labade](https://github.com/deepaklabade)