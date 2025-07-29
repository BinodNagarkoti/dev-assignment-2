# Project Title: User Management Dashboard

## Introduction

This project is a full-stack web application built with Next.js, designed to serve as a comprehensive dashboard for managing users. It features a robust authentication system, a user management interface with CRUD functionality, and detailed project documentation. The application is built with a focus on performance, scalability, and best practices in modern web development.

---

## Requirements

To run this project locally, you will need the following installed on your system:

*   **Node.js:** Version 20.x or higher
*   **pnpm:** This project uses `pnpm` as the package manager. You can install it globally by running `npm install -g pnpm`.

---

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Fork and Clone the Repository

First, fork the repository to your own GitHub account. Then, clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/proj2.git
cd proj2
```

### 2. Install Dependencies

Install the project dependencies using `pnpm`:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Update the variables in `.env.local` with your own configuration. At a minimum, you will need to provide a `NEXTAUTH_SECRET`. You can generate one using the following command:

```bash
openssl rand -base64 32
```

### 4. Run the Application

Start the development server:

```bash
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

This project includes several scripts to help with development:

*   `pnpm run dev`: Starts the development server.
*   `pnpm run build`: Builds the application for production.
*   `pnpm run start`: Starts the production server.
*   `pnpm run lint`: Lints the code using Biome.
*   `pnpm run format`: Formats the code using Biome.
*   `pnpm run test`: Runs the unit tests using Jest.

---

## Core Technologies

*   **Next.js:** React framework for building full-stack applications.
*   **TypeScript:** Strongly typed superset of JavaScript.
*   **NextAuth.js:** Authentication for Next.js applications.
*   **React Query:** Data fetching and state management.
*   **Ant Design:** UI component library.
*   **Ultracite & Biome:** Code linter and formatter an alternative to eslint and prettier.
*   **Jest & React Testing Library:** For unit testing.
