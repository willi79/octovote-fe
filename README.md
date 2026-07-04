# OctoVote Frontend

Angular frontend for OctoVote — built with Angular 18 and TypeScript.

## Prerequisites

- Node.js 20+
- Yarn
- OctoVote backend running (see [octovote-server](https://github.com/your-org/octovote-server))

## Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd octovote-fe

# 2. Install dependencies
yarn install
```

Open `src/environment/environment.ts` and set your backend API URL:

```ts
apiUrl: 'http://localhost:4000/api'
```

## Running the App

```bash
# development
yarn start

# production build
yarn build
```

App runs at `http://localhost:4200`.

## Project Structure

```
src/app/
  core/
    model/         # TypeScript interfaces
    service/       # AuthService, VoteService, UserService
    guard/         # authGuard, roleGuard
    interceptor/   # authInterceptor
  feature/
    login/         # login and register page
    vote/          # voter ballot page
    admin/
      admin-results/  # vote results page
      admin-users/    # user management page
  shared/
    navbar/        # top navigation bar
environment/       # environment configuration
```

## Routes

| Route            | Access     | Description        |
|------------------|------------|--------------------|
| `/login`         | Public     | Login and register |
| `/vote`          | User only  | Cast vote          |
| `/admin/results` | Admin only | View vote results  |
| `/admin/users`   | Admin only | Manage users       |

## CI/CD

GitHub Actions runs a production build check on every PR and push to master.
