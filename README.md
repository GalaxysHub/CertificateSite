# Certificate Testing Platform

A modern, production-ready Next.js 14+ application for creating and managing certification tests with automated certificate generation. Built with TypeScript, Prisma, NextAuth.js, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, and Tailwind CSS
- **Authentication**: Secure authentication with NextAuth.js supporting multiple providers
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Test Management**: Create, edit, and manage certification tests with multiple question types
- **Certificate Generation**: Automatic PDF certificate generation upon test completion
- **User Roles**: Support for different user roles (User, Instructor, Admin)
- **Responsive Design**: Mobile-first design with modern UI components
- **Production Ready**: Comprehensive ESLint, Prettier, and TypeScript configuration

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with Radix UI components
- **PDF Generation**: jsPDF and html2canvas
- **Form Handling**: React Hook Form with Zod validation
- **Code Quality**: ESLint, Prettier, TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd certificate-testing-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your actual values:
   - Database connection string
   - NextAuth secret and URL
   - OAuth provider credentials (optional)

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push the database schema
   npm run db:push

   # Optional: Open Prisma Studio to view your database
   npm run db:studio
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
certificate-testing-platform/
├── src/
│   ├── app/                 # Next.js 14 App Router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── tests/          # Test management pages
│   │   └── certificates/   # Certificate pages
│   ├── components/         # Reusable React components
│   │   ├── ui/            # UI primitives
│   │   ├── forms/         # Form components
│   │   └── layouts/       # Layout components
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
└── config files           # Various configuration files
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript type checking

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
```

## Database Schema

The application includes a comprehensive database schema with the following main entities:

- **Users**: User accounts with role-based access control
- **Tests**: Certification tests with questions and settings
- **Questions**: Test questions with various types and options
- **TestAttempts**: User test attempts and results
- **Certificates**: Generated certificates for successful completions
- **Sessions/Accounts**: NextAuth.js authentication tables

## Authentication

The platform supports multiple authentication methods:

- **Credentials**: Email/password authentication
- **OAuth Providers**: Google, GitHub (configurable)
- **Role-based Access**: User, Instructor, Admin roles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy automatically

### Docker

```bash
# Build Docker image
docker build -t certificate-testing-platform .

# Run container
docker run -p 3000:3000 certificate-testing-platform
```

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/certificate_testing_db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/certificate-testing-platform/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## Roadmap

- [ ] Advanced analytics and reporting
- [ ] Bulk user management
- [ ] Custom certificate templates
- [ ] Multi-language support
- [ ] Advanced question types
- [ ] API documentation
- [ ] Mobile app integration
