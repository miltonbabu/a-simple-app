# NoteVault - Modern Note-Taking Application

A production-quality full-stack note-taking application built with Next.js 14+, TypeScript, PostgreSQL, and modern UI components.

## Features

- **Authentication**: User registration & login with bcrypt password hashing
- **Notes CRUD**: Create, edit, delete, pin, archive, and favorite notes
- **Categories**: Organize notes with color-coded categories
- **Tags**: Add flexible tagging system with autocomplete
- **Search & Filter**: Full-text search with category/tag filters
- **Dark/Light Theme**: Beautiful theme switching with next-themes
- **Responsive Design**: Mobile-first approach with sidebar navigation
- **Dashboard**: Statistics overview with recent activity
- **Grid/List View**: Toggle between different note display modes

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Credentials Provider
- **Styling**: Tailwind CSS + shadcn/ui Components
- **Forms**: React Hook Form + Zod Validation
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd notevault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/notevault?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-random-secret-here"
   ```

4. **Generate a secure NEXTAUTH_SECRET**:
   You can generate one using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Set up the database**:
   ```bash
   # Push schema to database (for development)
   npx prisma db push
   
   # Or create a migration (for production)
   npx prisma migrate dev --name init
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
notevault/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Sidebar, Header, MobileNav
│   │   ├── notes/            # Note-related components
│   │   ├── categories/       # Category management
│   │   ├── tags/             # Tag components
│   │   ├── auth/             # Login/Register forms
│   │   └── shared/           # Reusable components
│   ├── lib/                   # Utilities, auth config, validations
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript type definitions
├── src/middleware.ts          # Route protection middleware
├── .env.local                # Environment variables
└── package.json              # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database GUI
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- All auth routes at `/api/auth/[...nextauth]` - NextAuth handler

### Notes
- `GET /api/notes` - List notes (with filtering/pagination)
- `POST /api/notes` - Create note
- `GET /api/notes/[id]` - Get single note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Categories
- `GET /api/categories` - List user's categories
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Tags
- `GET /api/tags` - List tags used by user
- `POST /api/tags` - Create tag

### Stats
- `GET /api/stats` - Dashboard statistics

## Database Schema

The application uses five main models:

1. **User** - User accounts with email/password authentication
2. **Category** - Note categorization with colors and icons
3. **Tag** - Flexible tagging system (shared across users)
4. **Note** - Main content entity with rich metadata
5. **NoteTag** - Many-to-many relationship between Notes and Tags

## Features in Detail

### Authentication System
- Secure password hashing with bcrypt (12 rounds)
- Session-based authentication with JWT strategy
- Protected route middleware
- Automatic redirect for authenticated users on auth pages

### Note Management
- Rich text editing with textarea support
- Pin important notes for quick access
- Archive old notes to declutter workspace
- Mark favorites for quick retrieval
- Search across title and content
- Sort by date created, modified, or title
- Grid and list view modes

### Organization
- Color-coded categories with custom icons
- Flexible tag system with autocomplete suggestions
- Filter notes by multiple criteria simultaneously

### UI/UX Highlights
- Smooth animations and transitions
- Loading skeletons for better perceived performance
- Empty states with actionable prompts
- Confirmation dialogs for destructive actions
- Fully responsive mobile design
- Accessible keyboard navigation
- Dark mode with system preference detection

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | Yes |

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format is correct
- Verify database exists: `createdb notevault`

### Prisma Issues
- Regenerate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset`

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm node_modules && npm install`

## Security Considerations

- Passwords hashed with bcrypt (not stored in plain text)
- Input validation on all forms using Zod schemas
- Route protection via middleware
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping

## Performance Optimizations

- Debounced search input
- Pagination for note lists
- Lazy loading of heavy components
- Optimistic UI updates where appropriate
- Efficient database queries with proper indexing

## License

This project is for educational and personal use.

## Contributing

This is a demonstration project showcasing modern web development best practices.
