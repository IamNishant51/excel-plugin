# 🚀 Zero-Config Deployment (GitHub Pages)

You don't need a website. Your plugin lives in your code repo.

## Step 1: Push Codes
1.  Open Terminal.
2.  Run `git add .`
3.  Run `git commit -m "Build for GitHub Pages"`
4.  Run `git push`

## Step 2: Enable GitHub Pages
1.  Go to your GitHub Repo: `https://github.com/IamNishant51/excel-plugin`
2.  Click **Settings** > **Pages** (on sidebar).
3.  Under **Build and deployment**:
    *   Source: `Deploy from a branch`
    *   Branch: `main`
    *   Folder: `/docs` (Important!)
4.  Click **Save**.
5.  Wait 1 minute. Refresh. It will show a URL (e.g., `https://iamnishant51.github.io/excel-plugin/`).

## Step 3: Update Manifest
1.  Open `manifest.prod.xml`.
2.  Replace `REPLACE_WITH_YOUR_URL` with that GitHub URL.
    *   Example: `https://iamnishant51.github.io/excel-plugin/taskpane.html` -> Wait!
    *   If URL is `.../excel-plugin/`, then asset is `.../excel-plugin/taskpane.html`.
    *   So just replace `REPLACE_WITH_YOUR_URL` with `https://iamnishant51.github.io/excel-plugin`.
3.  Send `manifest.prod.xml` to friends.

## Step 4: Install
1.  Insert > Add-ins > MyApps > Upload My Add-in.
2.  Select the XML file.
3.  Done!
