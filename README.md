# Vibe Code Checklist

**Is your app actually finished?**

A vibe-coded demo can look done and still be missing a real 404 page, its own page titles, a privacy policy, or a loading state. This list catches that before you ship.

**[Open the checklist](https://delexoo.github.io/vibe-code-checklist/)**

## Pick one

### 1. Check it yourself

1. Open the site and choose **Check by hand**.
2. Tick what your app already has.
3. If a row is only for forms, accounts, cookies, payments, or a blog, and your app does not have that, press **Doesn't apply**.
4. Press **Download HTML report**.

Your ticks stay in this browser. The report is a file on your computer named `vibe-audit.html`.

### 2. Let your editor check the app

1. Open **your app** in Cursor or another AI editor. Leave this repo closed.
2. On the site, choose **Paste the prompt**, or copy the prompt below.
3. Wait. Your assessment results open for you when it finishes.

The editor writes that report, opens it, and leaves the rest of your app alone.

```text
Audit this workspace against the Vibe Code Checklist.

First read this workspace and say what the app is for: the end goal, who it is for, and which features it actually has. Then judge only the checks that fit that app. A check the product does not need is not a failure.

Source of truth (read these before judging anything):
https://github.com/Delexoo/vibe-code-checklist/blob/main/PROMPT.md
https://github.com/Delexoo/vibe-code-checklist/blob/main/checklist.json

Follow PROMPT.md exactly. Inspect THIS workspace, not the checklist repo. Write a self-contained vanilla HTML report at vibe-audit.html showing what passed, what is missing, and what does not apply. When the file is written, open it in the default browser so the assessment results appear on their own. Do not change application code.
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
- Compressed images
- No secrets in the repo, visitor text that cannot inject script, private pages and admin tools kept private, sessions kept out of local storage, and one person cannot open another's data by changing an id
- Packages on a supported version, with no known high-severity holes
- Images, fonts, and code you have the right to use, plus real reviews if you show any
- A refund rule if you charge money, the amount and charge date before they pay, renewal terms beside a subscribe button, a signed payment webhook, a check that the processor allows what you sell, and opt-in marketing email with a postal address
- A way to report and remove posts or uploads, the rules for what people may post, and a DMCA agent when that content is for people in the United States
- A cap on outbound email, paid API calls, uploads per account, and requests per person
- Forms that label fields, show errors, and confirm success
- Account settings, a way to sign out, a minimum password length, an age check at signup, a verified email before the account is active, and a way to delete personal data, only if people can sign in
- A README that says how to run the app, and, if you have a database, backups, parameterized queries, saved fields the server chose, and no port open to the whole internet

The full list is in [checklist.json](checklist.json). The rules the editor must follow are in [PROMPT.md](PROMPT.md).

## License

[MIT](LICENSE)
