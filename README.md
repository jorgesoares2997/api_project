# GitHub Team & Repository Manager

A web application built with Next.js, TypeScript, and Tailwind CSS that allows you to manage GitHub teams and repositories with ease.

## Features

- GitHub OAuth authentication
- Create new teams in organizations
- Create new repositories
- Add teams to repositories with appropriate permissions
- Modern and responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- A GitHub account with organization access
- GitHub OAuth App credentials

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd github-team-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a GitHub OAuth App:
   - Go to GitHub Settings > Developer Settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in the following details:
     - Application name: GitHub Team Manager
     - Homepage URL: http://localhost:3000
     - Authorization callback URL: http://localhost:3000/api/auth/callback/github
   - Click "Register application"
   - Copy the Client ID and Client Secret

4. Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

5. Generate a secure secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

6. Start the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Sign in with GitHub" to authenticate
2. Enter your organization name
3. Create a new team by providing:
   - Team name
   - Team description (optional)
4. Create a new repository by providing:
   - Repository name
   - Repository description (optional)
   - Privacy setting (public/private)
5. The team will be automatically added to the repository with push permissions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
