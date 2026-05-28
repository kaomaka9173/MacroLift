# MacroLift

MacroLift is a private, local-only mobile web app for tracking daily macros and a 5-day workout split. It is designed for iPhone use first, with a clean green, black, grey, and white interface.

## Features

- Daily macro entries for calories, protein, carbs, fats, and sugars
- Daily macro totals with individual entry deletion
- Editable daily macro goals with progress bars for calories, protein, fats, and carbs
- Reset Day action with confirmation
- Workout tracker for Legs, Push, Pull, Upper, and Lower
- Add, edit, complete, and delete exercises per workout day
- Weekly Reset Done action that clears completed checkmarks while keeping exercises saved
- Local browser persistence with `localStorage`
- Basic PWA manifest and app icons for adding to an iPhone home screen

## Local-Only Privacy

MacroLift has no backend, database, authentication, cloud sync, analytics, payments, or tracking. Data is stored only in the browser using these localStorage keys:

- `macrolift_macro_entries`
- `macrolift_macro_goals`
- `macrolift_workout_data`

If browser storage is cleared, the saved MacroLift data will be removed.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` type-checks and builds the app
- `npm run preview` serves the production build locally

## PWA Notes

The app includes a web manifest, SVG favicon, and Apple touch icon. On iPhone, run or host the app locally, open it in Safari, then use Share > Add to Home Screen.

## Using the app on iPhone when away from home

MacroLift can be deployed as a static site through GitHub Pages. GitHub Pages only serves the app files; it does not store your macro entries, workout data, goals, or any private user data.

After deployment, your computer does not need to be on. Open the GitHub Pages URL in Safari on your iPhone, then use Safari Share > Add to Home Screen to install MacroLift as a basic PWA.

The app data is stored locally in the iPhone browser using `localStorage`. Data entered on your computer and data entered on your phone are separate because each browser/device has its own localStorage. They will stay separate unless an export/import or sync feature is added later.

If the GitHub Pages URL changes, localStorage data may not carry over automatically because browser storage is tied to the site origin and path.

### GitHub Pages deployment

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the Vite app and deploys the `dist` folder to GitHub Pages whenever changes are pushed to the `main` branch. You can also run the workflow manually from the GitHub Actions tab.

Before the first deployment, enable GitHub Pages in the repository settings:

1. Go to Settings > Pages.
2. Set Source to GitHub Actions.
3. Make sure your default branch is `main`, or update the workflow branch if you use a different default branch.
4. Push the repo to GitHub.
5. Push to `main` or run the Deploy to GitHub Pages workflow manually.

For a project site such as `https://USERNAME.github.io/REPO_NAME/`, the workflow sets the Vite base path automatically from the repository name so CSS, JavaScript, icons, the manifest, and the service worker load from the correct URL.
