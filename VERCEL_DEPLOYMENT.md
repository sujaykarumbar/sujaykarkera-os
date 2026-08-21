# Deploying Sujay Karkera OS on Vercel

This project is configured as a **Vite static site** for Vercel. Its production build output is `dist/public`, and `vercel.json` includes a client-side routing fallback for the OS interface.

## Option 1: Deploy from GitHub

1. Push this project to a GitHub repository.
2. In the [Vercel dashboard](https://vercel.com/new), choose **Add New → Project** and import that repository.
3. Vercel will detect the included configuration. Confirm these values if prompted:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist/public` |

4. Click **Deploy**. Future pushes to the connected branch will create deployments automatically.

## Option 2: Deploy from the command line

Install dependencies first, then authenticate with Vercel:

```bash
pnpm install
pnpm exec vercel login
```

Create a preview deployment:

```bash
pnpm vercel:preview
```

Create a production deployment:

```bash
pnpm vercel:deploy
```

> The Vercel CLI is included as a development dependency. Do not commit `.vercel/`; it stores local project-link metadata.
