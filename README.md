# LogiCola

LogiCola is a web-based instructional program that helps students learn logic. It is a remake of the original LogiCola software created by the late Professor Harry Gensler, built using modern web technologies.

## Project Structure

The project follows a standard Next.js project structure with some additional directories and files:

- `__tests__`: Contains test files for various components and pages.

  - `app`: Contains tests for pages.
  - `components`: Contains tests for individual components.

- `app`: Contains the main application code.

  - `[chapter]`: Dynamic route for individual chapters.
    - `[subchapter]`: Dynamic route for subchapters within a chapter.
      - `quiz`: Contains the quiz page for a subchapter.
    - `layout.tsx`: Layout component for chapter pages.
    - `page.tsx`: Page component for displaying a chapter.
  - `auth`: Contains the authentication page.
  - `error`: Contains the error page.
  - `layout.tsx`: Main layout component for the application.
  - `page.tsx`: Home page component.

- `components`: Contains reusable components used throughout the application.

  - `NoSSR`: Component for rendering content only on the client-side.
  - `question`: Contains components related to displaying and interacting with questions.
  - `quiz`: Contains components for the quiz functionality.
  - `ui`: Contains UI components such as accordion, button, card, dropdown menu, input, and label, coming from [ShadCN UI](https://ui.shadcn.com/)
  - Other individual component files.

- `lib`: Contains utility functions and libraries.

  - `serversidePostHog.ts`: PostHog client for server-side usage.

  - `supabase-browser.ts`: Supabase client for browser-side usage.

  - `supabase-server.ts`: Supabase client for server-side usage.

  - `utils.ts`: Utility functions used in the application.

- `public`: Contains public assets such as images.

- `types`: Contains TypeScript type definitions.

- Other configuration files and directories such as `next.config.js`, `tailwind.config.js`, `tsconfig.json`, etc.

## Testing

The project includes tests for various components and pages. The tests are located in the `__tests__` directory and are organized into subdirectories corresponding to the component or page being tested (they "mirror" the project structure).

The tests are written using Vitest and React Testing Library.

The project uses Tailwind CSS for styling. The styles are defined in the `tailwind.config.js` file and are applied to components using utility classes.

## Prerequisites

The project uses the PNPM package manager. To install PNPM, run the following command:

```bash
npm install -g pnpm
```

For user authentication, the project uses Supabase.

For analytics, the project uses PostHog.

You will need to create accounts for these services and set up projects to get the required environment variables.

## Environment Variables

The project uses environment variables to store sensitive information such as API keys and secrets. These variables are stored in a `.env.local` file at the root of the project.

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.

- `NEXT_PUBLIC_POSTHOG_API_KEY`: The API key for your PostHog project.
- `NEXT_PUBLIC_POSTHOG_HOST`: The host for your PostHog project.

Create a `.env.local` file at the root of the project and add these variables to it.

## Installation

To install the project dependencies, run the following command:

```bash
pnpm install
```

## Development

To start the development server, run the following command:

```bash
pnpm dev
```

This will start the Next.js development server and open the application in your default browser.

## Build

To build the project for production, run the following command:

```bash
pnpm build
```
