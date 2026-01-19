# ArcGIS ExB Widget Generator

ArcGIS ExB Widget Generator is an AI-assisted web app that guides users through the BMAD workflow to design, spec, and generate ArcGIS Experience Builder widgets.

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS
- Supabase (auth, database, storage)
- Monaco Editor
- Zustand
- ArcGIS Maps SDK for JavaScript + Jimu framework (targeted output)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Create a `.env.local` file for Supabase credentials and any API keys.
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Documentation
BMAD workflow docs live in [`/docs`](./docs) and cover analysis, planning, solutioning, implementation, and research phases.

## Deployment
The project includes a `vercel.json` for Vite SPA deployment. Deploy on Vercel with the build command `npm run build` and output directory `dist`.
