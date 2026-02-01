# IT Experiment - 1

A web application for creating and managing blog posts with user authentication and role-based access.

## About

This is a blogging platform where users can create, view, and manage their own posts. The application includes an admin panel for managing users and content.

## Features

- User authentication and account management
- Create and manage blog posts
- View posts from all users
- Admin panel for user and content management
- Responsive design that works on all devices

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to use the application.

## Required Services

Before running the application, you need to set up:

1. Clerk account for authentication
2. Convex project for the database

Configure these services in your environment variables.

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Project Structure

- app - Main application pages and layouts
- components - User interface components
- convex - Database schema and functions
- lib - Shared utilities and configurations

## Technology

Built with Next.js, React, TypeScript, and Tailwind CSS. Uses Convex for data storage and Clerk for user authentication.
