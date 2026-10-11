# Banana Android Distribution

A separate Next.js website that publishes the latest Android APK from the private `abhishekkushwah777/BANANA_app_reactNative` GitHub repository. The GitHub token stays on the server. The browser receives release metadata and a same-origin download URL; the download route checks that the asset belongs to the latest release and streams the private file.

## Requirements

- Node.js 20.9 or later
- npm
- A GitHub fine-grained personal access token with read-only **Contents** access to `BANANA_app_reactNative`

## Local setup

1. Create a fine-grained token in GitHub **Settings → Developer settings → Personal access tokens**. Limit repository access to `BANANA_app_reactNative` and grant **Contents: Read-only**.
2. Copy `.env.example` to `.env.local` and set `GITHUB_TOKEN`. Keep `.env.local` out of version control.
3. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000).

The repository needs a published, non-draft latest release with an uploaded `.apk` asset. When multiple APKs are attached, one with “universal” in its filename is preferred. The release metadata endpoint is `/api/release`.

## Production deployment

Deploy to a Node.js host with Next.js App Router support, such as Vercel. Static export is not supported because the app needs server-side access to the private GitHub repository.

1. Push this separate website project to GitHub and import it into your host using the Next.js preset.
2. Add `GITHUB_TOKEN`, `GITHUB_OWNER`, and `GITHUB_REPO` as server environment variables. Never prefix the token with `NEXT_PUBLIC_`.
3. Redeploy. Confirm the home page shows the latest version and the APK button downloads the file. Check `/api/release` for the metadata response.

Release metadata is cached for five minutes. APK downloads are streamed through the server and marked private, no-store.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint the project
