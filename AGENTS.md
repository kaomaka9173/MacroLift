# AGENTS.md

## Project

This repository contains MacroLift, a private local-only mobile web app for tracking daily macros and workouts.

## Primary User

The app is for one person using it locally on an iPhone. Do not add multi-user features.

## Product Rules

- No backend
- No database
- No authentication
- No cloud sync
- No analytics
- No external tracking
- No paid services
- No unnecessary dependencies
- All app data should persist locally using localStorage
- Mobile-first design is required
- iPhone usability is more important than desktop usability

## Tech Stack

Use:

- React
- Vite
- TypeScript
- CSS

Avoid large UI frameworks unless explicitly requested.

## Design Rules

Use a minimal, modern fitness-focused design.

Color palette:

- Green
- Black
- Grey
- White

Prioritize:

- Simple layouts
- Large touch targets
- Clear spacing
- Rounded cards
- Strong contrast
- Obvious active states
- Clean typography

## Code Quality Rules

- Keep components small and readable.
- Use TypeScript interfaces/types for app data.
- Keep localStorage access safe with fallback defaults.
- Avoid duplicated logic.
- Prefer straightforward code over clever abstractions.
- Do not introduce backend assumptions.
- Do not add secrets, API keys, or environment-dependent services.

## Testing / Validation

Before completing a task:

- Run `npm run build`.
- Fix TypeScript errors.
- Confirm the app can run locally.
- Confirm localStorage persistence still works.
- Confirm mobile layout is not broken.

## README Expectations

Keep README.md current with:

- Project description
- Local setup instructions
- Available scripts
- Build instructions
- Notes about local-only data persistence
