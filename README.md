# Vibe Code Checklist

**Is your app actually finished?**

A vibe-coded demo can look done and still be missing a real 404 page, its own page titles, a privacy policy, or a loading state. It can also still look generated: purple gradients, glows, emoji labels, and copy that shouts. This list catches that before you ship.

**[Open the checklist](https://delexoo.github.io/vibe-code-checklist/)**

## Pick one

### 1. Check it yourself

1. Open the site and choose **Check by hand**.
2. Tick what your app already has.
3. If a row is only for forms, accounts, cookies, payments, a blog, an AI feature, credits and codes, or an app used every day, and your app does not have that, press **Doesn't apply**. A website can set aside the Android back-gesture row.
4. Press **Download HTML report**.

Your ticks stay in this browser. The report is a file on your computer named `vibe-audit.html`.

### 2. Let an agent check the app

1. Open **your app** in Claude, Claude Code, Cursor, Codex, or another coding agent. Leave this repo closed.
2. On the site, choose **Paste the prompt**, or copy the prompt below.
3. Paste it into the chat that can read that project.
4. Wait. The agent writes `vibe-audit.html` and opens it when this machine has a desktop.

The agent leaves the rest of your app alone. If it cannot open a browser, the file is still the report.

```text
Audit the project that is open right now against the Vibe Code Checklist.

You can be any coding agent. Use ordinary file reads and, if you have them, a web fetch. Do not install packages, plugins, or skills. Do not change application code.

First read this project and say what the app is for: the end goal, who it is for, and which features it actually has. Then judge only the checks that fit that app. A check the product does not need is not a failure.

Before you judge anything, read the procedure and the checklist from the raw files, not the GitHub web page:
https://raw.githubusercontent.com/Delexoo/vibe-code-checklist/main/PROMPT.md
https://raw.githubusercontent.com/Delexoo/vibe-code-checklist/main/checklist.json

If a raw address fails, try the same file name on https://delexoo.github.io/vibe-code-checklist/

Follow PROMPT.md exactly. Inspect this project, not the checklist repository. If you cannot read both files, stop and name the address that failed. Do not invent checks.

Write one self-contained HTML file named vibe-audit.html at the root of this project. If you cannot write a file, put that same HTML in your reply and say to save it as vibe-audit.html.

After the file exists, open it in the default browser if this machine has a desktop. If you cannot, say the full path and that the file is ready. Then reply with what the app is, the overall result, and the required items still open.
```

## What the report shows

- **Overall** — ready to ship, required checks in place, or not ready
- **Fix these first** — the required gaps, each with a short instruction
- **Done** — already true, with proof. Green highlight.
- **Warning** — worth doing, and it can wait. Yellow highlight.
- **Missing** — fix this before you ship. Red highlight.
- **Does not apply** — your app does not have that feature, so it is not a fail

A real check lists every item. [This sample](https://delexoo.github.io/vibe-code-checklist/sample-report.html) only shows the shape. The results in it are made up.

## What the list looks for

- Pages people hit when something is missing, empty, or still loading
- A title and description on each page, plus the usual search files
- A clear explanation of who you are, for assistants and chat tools
- Privacy policy, terms, and a cookie choice if you use analytics. Fonts come from your own site. Session replay stays off, or it masks what people type.
- Favicon, phone layout, contrast, and keyboard focus
- Skeletons that match the layout, tap targets larger than the icon, safe areas, stable numbers, and, in an app used every day, a command menu, undo, and optimistic updates
- A payment retry that carries one idempotency key so a second tap cannot charge twice
- A screen that looks like this product: neutral surfaces, one accent, icons from one set, spacing on a 4px scale, plain copy, and a first view of the product itself
- Compressed images
- No secrets in the repo, its history, the client bundle, or the build log, and the live site does not serve `.git` or `.env`. Visitor text cannot inject script or change a SQL or NoSQL query. Private and admin pages are checked in the route itself. Sessions stay out of local storage, and one person cannot open another's data by changing an id
- Login, signup, and reset that answer the same way whether or not the email exists, a reset link built from config, a server-side price, private storage rules, and a code or balance that cannot be spent twice
- No server fetch of a visitor's URL, no visitor input in a file path, unpublished production source maps, pinned or self-hosted scripts, and an AI feature with only the access it needs. If the model provider is down or rate-limited, the page says so.
- Packages on a supported version, with no known high-severity holes, and no package that only wraps a built-in
- Images, fonts, and code you have the right to use, plus real reviews if you show any
- A refund rule if you charge money, the amount and charge date before they pay, renewal terms beside a subscribe button, a signed payment webhook, a check that the processor allows what you sell, and opt-in marketing email with a postal address
- A way to report and remove posts or uploads, the rules for what people may post, and a DMCA agent when that content is for people in the United States
- A cap on outbound email, text messages, paid API calls, uploads per account, and requests per person
- Forms that label fields, show errors, and confirm success
- Account settings, a way to sign out, a minimum password length, an age check at signup, a verified email before the account is active, and a way to delete personal data, only if people can sign in
- A README that says how to run the app and where the main parts live, a test for a behavior that matters, and, if you have a database, backups you can restore, parameterized queries, saved fields the server chose, rules that are not wide open, and no port open to the whole internet

The full list is in [checklist.json](checklist.json). The rules any coding agent must follow are in [PROMPT.md](PROMPT.md).

## License

[MIT](LICENSE)

The design checks are adapted from [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The rest of this project is MIT.
