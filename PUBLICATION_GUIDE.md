# How to Publish SheetCraft AI for Everyone 🚀

Publishing an Excel Add-in involves two main parts:
1.  **Hosting the Frontend**: The HTML/JS/CSS files must live on a public web server (like a normal website).
2.  **Deploying the Manifest**: The XML file tells Excel where to find your website.

---

## Step 1: Host the Frontend (Free & Secure)

Since SheetCraft AI is a client-side app (no backend server required), you can host it for free on **Netlify**, **Vercel**, or **GitHub Pages**. All three provide free SSL (HTTPS), which is required by Office.

### Option A: Using Netlify (Recommended)
1.  Run `npm run build` in your terminal. This creates a `dist` folder.
2.  Go to [Netlify Drop](https://app.netlify.com/drop).
3.  Drag and drop the `dist` folder onto the page.
4.  It will deploy instantly and give you a URL like `https://funny-puffin-123456.netlify.app`.
5.  **Copy this URL.** This is your "Production URL".

---

## Step 2: Update Your Manifest

Now you need to tell Excel to look at your new Netlify URL instead of `localhost`.

1.  Open `manifest.xml` in VS Code.
2.  Press `Ctrl+H` to Find & Replace.
3.  **Find:** `https://[YOUR_HTTPS_DOMAIN]`
4.  **Replace with:** Your Netlify URL (e.g., `https://funny-puffin-123456.netlify.app`) **without** the trailing slash.
    *   *Note: If your URL has a slash at the end, remove it to be safe.*
5.  Save the file.

Alternatively, you can rebuild the project one last time with your production URL:
1.  Open `webpack.config.js`.
2.  Find `const urlProd = "..."` (line ~7) and paste your Netlify URL there.
3.  Run `npm run build` again.
4.  The `dist/manifest.xml` file will now be automatically updated with the correct URLs!

---

## Step 3: Deploy to Users

You have two ways to share this with others:

### Method A: Sideloading (Good for Testing / Small Teams)
1.  Send the `manifest.xml` file to your colleagues (email, Slack, etc.).
2.  Tell them to:
    *   Save the file to a folder on their computer.
    *   Open Excel on the Web (office.com) -> New Workbook.
    *   Go to **Insert** > **Add-ins**.
    *   Select **Upload My Add-in** and choose the `manifest.xml`.
    *   *Note: For Desktop Excel, they need to put the manifest in a network shared folder and add that folder to their Trust Center catalog.*

### Method B: M365 Admin Center (Best for Organizations)
If you are an admin for your company's Microsoft 365 account:
1.  Go to the [Microsoft 365 Admin Center](https://admin.microsoft.com).
2.  Navigate to **Settings** > **Integrated apps**.
3.  Click **Upload custom apps**.
4.  Choose "Upload manifest file (.xml)" and calculate select your `manifest.xml`.
5.  Assign it to users (e.g., "Everyone" or specific groups).
6.  The add-in will automatically appear in their Excel ribbon within 24 hours!

### Method C: Microsoft AppSource (Public Store)
To be in the public store for anyone in the world:
1.  You need a Microsoft Partner Center account ($19 fee).
2.  Submit your `manifest.xml` for validation.
3.  Microsoft reviews it (takes 1-3 days).
4.  Once approved, millions of users can find it in the "Store" tab in Excel.

---

## Security Audit Report ✅

We performed a security 
review of the codebase before release:
*   **API Keys**: No API keys are hardcoded. Users provide their own keys in Settings, which are stored locally in their browser `localStorage`. This is the most secure method for client-side apps.
*   **Source Code**: Source maps are disabled in production builds (via `webpack.config.js`), so your TypeScript code is not easily readable by end-users.
*   **Permissions**: The manifest requests `ReadWriteDocument`, which is the minimum required permission. No risky generic access rights.

Your app is secure and ready for deployment!
