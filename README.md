# Vibe Code Checklist

A preflight list for a vibe-coded web app. Use it to see what is already in place, and what is still missing, before you call the app finished.

The site: [https://delexoo.github.io/vibe-code-checklist/](https://delexoo.github.io/vibe-code-checklist/)

The machine-readable list: [checklist.json](checklist.json)

## Check it by hand

Open the site, tick what is true, and set conditional items aside when the app does not have that feature. Ticks stay in your browser. Download `vibe-audit.html` when you want a record.

## Hand it to your editor

Open the app in an AI code editor and paste:

```
Audit this workspace against the Vibe Code Checklist.

Source of truth (read these before judging anything):
https://github.com/Delexoo/vibe-code-checklist/blob/main/PROMPT.md
https://github.com/Delexoo/vibe-code-checklist/blob/main/checklist.json

Follow PROMPT.md exactly. Inspect THIS workspace, not the checklist repo. Write a self-contained vanilla HTML report at vibe-audit.html showing what passed, what is missing, and what does not apply. Do not change application code.
```

[PROMPT.md](PROMPT.md) is the procedure. A pass needs a file path or an explicit gap. The editor writes `vibe-audit.html` and leaves the application code as it is. [sample-report.html](sample-report.html) is a short fictional example of that scorecard.

## What the list covers

- **Pages and flows.** Custom 404, error and loading states, empty states, thank-you and payment confirmation when those flows exist.
- **Search engine optimization.** Unique titles and descriptions, canonical URLs, social cards, sitemap, robots.txt, one h1, alt text, viewport, article dates.
- **Generative engine optimization.** `llms.txt`, a clear who / what / who-for, quotable facts, attribution, structured data.
- **Answer and chat engine optimization.** A direct opening, FAQ or question headings, consistent facts.
- **Legal and consent.** Privacy policy, terms of service, a cookie refusal path when analytics exist, a way to make contact.
- **Identity and appearance.** Favicon set, theme color, responsive layout, contrast, visible focus, reduced motion.
- **Accessibility.** Page language, keyboard access, skip link, status beyond color, descriptive links.
- **Performance.** Compressed images, reserved image space, lazy loading below the fold.
- **Security.** No secrets in the repo or client, `.env` ignored, HTTPS, security headers, protected routes, private pages kept out of search, session cookie flags, server-side form validation.
- **Forms.** Labels, inline errors, a pending submit state, a success confirmation.
- **Accounts and settings.** Settings, password reset or an equivalent, export or deletion, autocomplete on auth fields.
- **Project hygiene.** A README that explains how to run the app, and an example env file with no secrets.

Conditional checks are marked not applicable when the app has no forms, accounts, analytics, payments, or articles. They are not failed for a feature the app does not have.

## License

The checklist text and site are released under the [MIT License](LICENSE).
