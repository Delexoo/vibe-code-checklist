# Vibe Code Checklist

**Is the app actually finished?**

A vibe-coded demo can look done and still be missing a real 404 page, its own page titles, a privacy policy, or a loading state. This list catches that before you ship.

**[Open the checklist](https://delexoo.github.io/vibe-code-checklist/)**

## Pick one

### 1. Check it yourself

1. Open the site.
2. Tick what your app already has.
3. If a row is only for forms, accounts, cookies, payments, or a blog, and your app does not have that, press **Doesn't apply**.
4. Press **Download HTML report**.

Your ticks stay in this browser. The report is a file on your computer named `vibe-audit.html`.

### 2. Let your editor check the app

1. Open **your app** in Cursor or another AI editor. Leave this repo closed.
2. Paste the prompt below into the chat.
3. Open `vibe-audit.html` in your project folder.

The editor writes that report and leaves the rest of your app alone.

```text
Audit this workspace against the Vibe Code Checklist.

Source of truth (read these before judging anything):
https://github.com/Delexoo/vibe-code-checklist/blob/main/PROMPT.md
https://github.com/Delexoo/vibe-code-checklist/blob/main/checklist.json

Follow PROMPT.md exactly. Inspect THIS workspace, not the checklist repo. Write a self-contained vanilla HTML report at vibe-audit.html showing what passed, what is missing, and what does not apply. Do not change application code.
```

## What the report shows

- **In place** — already done, with proof
- **Missing** — still to do
- **Does not apply** — your app does not have that feature, so it is not a fail

A real check lists every item. [This sample](https://delexoo.github.io/vibe-code-checklist/sample-report.html) only shows the shape. The results in it are made up.

## What the list looks for

- Pages people hit when something is missing, empty, or still loading
- A title and description on each page, plus the usual search files
- A clear explanation of who you are, for assistants and chat tools
- Privacy policy, terms, and a cookie choice if you use analytics
- Favicon, phone layout, contrast, and keyboard focus
- Compressed images
- No secrets in the repo, and private pages kept private
- Forms that label fields, show errors, and confirm success
- Account settings, only if people can sign in
- A README that says how to run the app

The full list is in [checklist.json](checklist.json). The rules the editor must follow are in [PROMPT.md](PROMPT.md).

## License

[MIT](LICENSE)
