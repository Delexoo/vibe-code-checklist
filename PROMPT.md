# Vibe Code Checklist audit procedure

You are auditing the workspace that is open in the editor. You are not auditing the Vibe Code Checklist repository.

## Stop if this is the checklist repo

If the workspace root contains `checklist.json` whose `name` is `Vibe Code Checklist` and this `PROMPT.md` file, stop. Tell the person to open their own app and paste the prompt there. Do not grade this checklist as if it were their product.

## Read first

Read every item in `checklist.json` before you judge anything. Each item has `id`, `category`, `title`, `why`, `howToVerify`, `howToFix`, `severity` (`required` or `recommended`), and `appliesWhen` (`always`, `forms`, `accounts`, `analytics`, `payments`, `blog`, `dependencies`, `database`, `email`, `api`, `uploads`, or `claims`).

`sample-report.html` shows the report shape with fictional results. Do not copy those results.

## Learn what they are building

Do this before you mark any item. The score is about this product, not a generic website.

Read the README, the app name, the homepage or main screen, the routes, and any copy that says what the product does. From those files, write four things:

1. **Goal.** What the person is trying to ship, in one or two sentences. If the README and the screens disagree, say so.
2. **Who it is for.**
3. **What this product includes.** Say which of these are present, started, or clearly promised by the UI, routes, or copy: public pages, forms, accounts, payments, analytics or non-essential cookies, articles, installed packages, a database, marketing email, an API, file uploads, reviews or statistics. A library that is installed and never used is not a feature.
4. **What this product will not need.** Name the checklist areas that do not fit the goal.

Put that picture in the report under **What this app is**, with the file paths you used. Do not invent a business the files do not support. If the goal is unclear, say what you found and what is still unclear.

## How to judge

Give every item exactly one status: `pass`, `fail`, or `not_applicable`.

- `pass` means you saw the requirement in this workspace. Cite a file path and what you found. A README promise is not evidence that a page exists. A framework default is not a custom page.
- `fail` means this app needs the check and it is missing, placeholder, or only a default. Name the paths you checked. Use the words `not found` when nothing is there.
- `not_applicable` means this app does not need the check. Say why, using the picture of the product. Unfinished work the app does need is a fail, not a skip.

Use `appliesWhen` as the usual signal, then check it against the product:

- `always`: judge it for a website or web app people open. Use `not_applicable` when `howToVerify` allows that, or when the workspace is a different kind of product and the check would not serve the goal. A private tool that should not be indexed does not fail for a missing sitemap. A library with no pages does not fail for a missing favicon. Say what the workspace is instead.
- `forms`: `not_applicable` only when this app has no form, checkout, or signup.
- `accounts`: `not_applicable` only when this app has no accounts or private areas.
- `analytics`: `not_applicable` only when this app uses no analytics and sets no non-essential cookies.
- `payments`: `not_applicable` only when this app does not take payment.
- `blog`: `not_applicable` only when this app does not publish articles or posts.
- `dependencies`: `not_applicable` only when this app installs no packages.
- `database`: `not_applicable` only when this app has no database.
- `email`: `not_applicable` only when this app sends no marketing email. A receipt or password reset does not make this apply.
- `api`: `not_applicable` only when this app has no API.
- `uploads`: `not_applicable` only when nobody can upload a file.
- `claims`: `not_applicable` only when this app shows no reviews, testimonials, or statistics.

Do not drop a security check that matches a feature the app has. A small app with accounts still needs protected routes. A form that shows visitor text still needs that text escaped. A public page still needs its own title.

Examples:

- A brochure site with a contact form needs the form checks and a privacy policy. It does not need accounts or payments.
- A members' app needs the account checks. It does not need article dates unless it has posts.
- An internal dashboard that is not meant to be found in search does not need a sitemap, `llms.txt`, or social cards. It does need login and private routes if people sign in.
- A script or library with no website does not need page, search, or favicon checks. Secrets and dependency checks still apply when it holds keys or installs packages.

Severity changes the label, not the status. A recommended item can fail.

If the dev server is off, judge the source. Say that the evidence is from source. Do not fail a check only because you did not click a running page when the source implements it. HTTPS and security headers need a deployment or host config; if neither exists, mark them missing and say that no production URL or header config was found.

Never invent a file. Never paste a secret value into the report. Name the file and the kind of secret only.

## What you may change

Create or overwrite `vibe-audit.html` at the workspace root. Do not create, edit, or delete any other file. Do not install packages. Do not change application data. Read-only inspection, that one report, and opening it is the whole job.

## Score

Applicable items are `pass` plus `fail`. `not_applicable` items are left out.

The score is the count of passes divided by the count of applicable items. Also count how many failed items are `required`.

The overall line is exactly one of these:

- `Ready to ship` when every applicable item passes.
- `Required checks are in place` when no required item fails and at least one recommended item fails.
- `Not ready to ship` when any required item fails.

## How to fix

For every failed item, write one or two sentences in **How to fix**. Start from that item's `howToFix` and name the file or page in this workspace. A person who has not read the checklist should be able to follow it. Do not paste exploit steps, secret values, or a patch that changes the app. Do not put a fix on items that pass or do not apply.

**Fix these first** lists only failed required items, in the same words. If none failed, that section is the sentence `None. No required item is open.` and has no list.

## Report file

Write one self-contained HTML document. Inline the CSS below. Do not load scripts, fonts, or images. Include every checklist item, in category order, under Missing, Warnings, Done, or Does not apply.

Use this document. Replace the bracketed fields. Repeat one `article` per item. Keep the class names.

Highlight the status words. Leave the letters in the normal ink color. `Done` gets a green highlight, `Warning` gets yellow, and `Missing` gets red. A recommended miss is `Warning`, class `warn`. A required miss is `Missing`, class `miss`. The overall line uses the same highlight: red when a required item is open, yellow when only warnings are open, green when every check that applies is done.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preflight report — [Project name]</title>
  <style>
    :root { --paper: #f3eadc; --ink: #1b1612; --muted: #4a433b; --line: #d9cbb6; --hl-pass: #b7ebc6; --hl-warn: #ffe56a; --hl-miss: #ffb4ae; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; font-size: 1.05rem; line-height: 1.5; }
    main { width: min(820px, calc(100% - 2rem)); margin: 2rem auto 4rem; }
    .kicker, .status, .meta dt, table, .evidence span, .fix span, footer, .cat { font-family: ui-monospace, "Cascadia Mono", "Segoe UI Mono", Consolas, monospace; }
    .kicker { letter-spacing: .12em; text-transform: uppercase; font-size: .72rem; margin: 0 0 .5rem; }
    h1 { font-size: 2.6rem; line-height: 1; font-weight: 560; margin: 0 0 1rem; }
    .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 1.5rem 0; }
    .meta div { border-top: 1px solid var(--ink); padding-top: .4rem; }
    .meta dt { font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
    .meta dd { margin: .2rem 0 0; }
    .score { border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); padding: 1rem 0; display: flex; gap: 1.5rem; align-items: baseline; }
    .fraction { font-size: 3rem; line-height: 1; margin: 0; font-variant-numeric: tabular-nums; }
    .fraction span { font-size: 1.25rem; color: var(--muted); }
    .score p { margin: 0; }
    table { width: 100%; border-collapse: collapse; font-size: .85rem; }
    caption { text-align: left; font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 .4rem; }
    th, td { text-align: left; padding: .45rem .5rem .45rem 0; border-bottom: 1px solid var(--line); vertical-align: top; }
    th:not(:first-child), td:not(:first-child) { text-align: right; font-variant-numeric: tabular-nums; }
    h2 { font-size: 1.5rem; margin: 2rem 0 .6rem; }
    .finding { border-top: 1px solid var(--line); padding: .9rem 0; }
    .finding header { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
    .finding h3 { margin: 0; font-size: 1.15rem; }
    .cat { margin: 0 0 .15rem; font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
    .key { margin: 1rem 0 0; }
    .mark, .status { color: var(--ink); background: transparent; padding: .08em .28em; box-decoration-break: clone; -webkit-box-decoration-break: clone; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .status { margin: 0; font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; text-align: right; display: inline-block; }
    .mark.pass, .finding.pass .status { background: var(--hl-pass); }
    .mark.warn, .finding.warn .status { background: var(--hl-warn); }
    .mark.miss, .finding.miss .status { background: var(--hl-miss); }
    .context p { margin: .45rem 0; }
    .why, .evidence, .fix { margin: .35rem 0 0; }
    .evidence span, .fix span { font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; display: block; color: var(--muted); }
    .evidence, .fix { overflow-wrap: anywhere; }
    .verdict-label { font-size: 1.7rem; line-height: 1.2; margin: 0 0 .4rem; display: inline; }
    .fix-list { margin: .2rem 0 0; padding-left: 1.2rem; }
    .fix-list li { margin: .45rem 0; }
    footer { margin-top: 2rem; color: var(--muted); font-size: .85rem; }
    @media (max-width: 640px) {
      .meta, .score, .finding header { display: flex; flex-direction: column; align-items: flex-start; }
      h1 { font-size: 2.1rem; }
      .status { text-align: left; }
    }
    @media print { body { background: #fff; } main { width: auto; margin: 0; } }
  </style>
</head>
<body>
  <main>
    <p class="kicker">Vibe Code Checklist</p>
    <h1>Preflight report</h1>
    <p class="key"><span class="mark pass">Done</span> already works. <span class="mark warn">Warning</span> can wait. <span class="mark miss">Missing</span> needs a fix before you ship.</p>
    <dl class="meta">
      <div><dt>Project</dt><dd>[Project name from the package, app, or folder]</dd></div>
      <div><dt>Generated</dt><dd>[Date]</dd></div>
      <div><dt>Source</dt><dd>Workspace audit</dd></div>
    </dl>
    <section class="context">
      <h2>What this app is</h2>
      <p><strong>Goal.</strong> [What they are trying to ship, from the files.]</p>
      <p><strong>Who it is for.</strong> [Audience, or say it is not stated.]</p>
      <p><strong>Checks that fit.</strong> [Which features this product has, and which checklist areas do not apply.]</p>
      <p class="evidence"><span>Based on</span>[File paths you actually read.]</p>
    </section>
    <section class="score">
      <p class="fraction">[passes]<span>/[applicable]</span></p>
      <p>[Percent]% of the checks that apply are in place. [Same detail as the overall section.]</p>
    </section>
    <section class="verdict">
      <h2>Overall</h2>
      <p class="verdict-label mark [pass, warn, or miss]">[Ready to ship, Required checks are in place, or Not ready to ship]</p>
      <p>[How many required items are open, then how many recommended items are open.]</p>
    </section>
    <section>
      <h2>Fix these first</h2>
      <ol class="fix-list">
        <li><strong>[Required item title].</strong> [Simple fix for this workspace.]</li>
      </ol>
    </section>
    <section>
      <h2>By category</h2>
      <table>
        <caption>Results by category</caption>
        <thead>
          <tr><th>Category</th><th>Done</th><th>Missing</th><th>Warning</th><th>Does not apply</th></tr>
        </thead>
        <tbody>
          <tr><td>[Category]</td><td>[n]</td><td>[n]</td><td>[n]</td><td>[n]</td></tr>
        </tbody>
      </table>
    </section>
    <section>
      <h2>Missing</h2>
      <article class="finding miss">
        <header>
          <div>
            <p class="cat">[Category title]</p>
            <h3>[Item title]</h3>
          </div>
          <p class="status">Missing</p>
        </header>
        <p class="why">[why from the checklist]</p>
        <p class="evidence"><span>Evidence</span>[Where you looked and what you found]</p>
        <p class="fix"><span>How to fix</span>[One or two sentences for this workspace. Required on every missing item.]</p>
      </article>
    </section>
    <section>
      <h2>Warnings</h2>
      <article class="finding warn">
        <header>
          <div>
            <p class="cat">[Category title]</p>
            <h3>[Item title]</h3>
          </div>
          <p class="status">Warning</p>
        </header>
        <p class="why">[why from the checklist]</p>
        <p class="evidence"><span>Evidence</span>[Where you looked and what you found]</p>
        <p class="fix"><span>How to fix</span>[One or two sentences. Required on every warning.]</p>
      </article>
    </section>
    <section>
      <h2>Done</h2>
      <article class="finding pass">
        <header>
          <div>
            <p class="cat">[Category title]</p>
            <h3>[Item title]</h3>
          </div>
          <p class="status">Done</p>
        </header>
        <p class="why">[why]</p>
        <p class="evidence"><span>Evidence</span>[File path and what you found]</p>
      </article>
    </section>
    <section>
      <h2>Does not apply</h2>
      <article class="finding na">
        <header>
          <div>
            <p class="cat">[Category title]</p>
            <h3>[Item title]</h3>
          </div>
          <p class="status">Does not apply</p>
        </header>
        <p class="why">[why]</p>
        <p class="evidence"><span>Evidence</span>[Why the condition is absent]</p>
      </article>
    </section>
    <footer>The score counts checks that are done, out of the checks that apply. A warning still counts. Something that does not apply does not. This file is the report. It does not change the app.</footer>
  </main>
</body>
</html>
```

Escape any HTML characters that came from the workspace so the report stays a document.

## When you finish

Open `vibe-audit.html` in the default browser yourself, from the workspace root. The assessment results should appear on their own. Do not ask the person to find or open the file.

Run the command for this operating system, and wait until it starts:

- Windows PowerShell: `Start-Process (Resolve-Path .\vibe-audit.html)`
- macOS: `open vibe-audit.html`
- Linux: `xdg-open vibe-audit.html`

If the command fails, say the full path and that the file is ready. Then reply with what the app is, the overall result, the required items still open, and the path `vibe-audit.html`. Do not start fixing the app.
