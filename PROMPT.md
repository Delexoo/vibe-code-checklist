# Vibe Code Checklist audit procedure

You are auditing the workspace that is open in the editor. You are not auditing the Vibe Code Checklist repository.

## Stop if this is the checklist repo

If the workspace root contains `checklist.json` whose `name` is `Vibe Code Checklist` and this `PROMPT.md` file, stop. Tell the person to open their own app and paste the prompt there. Do not grade this checklist as if it were their product.

## Read first

Read every item in `checklist.json` before you judge anything. Each item has `id`, `category`, `title`, `why`, `howToVerify`, `severity` (`required` or `recommended`), and `appliesWhen` (`always`, `forms`, `accounts`, `analytics`, `payments`, or `blog`).

`sample-report.html` shows the report shape with fictional results. Do not copy those results.

## What you may change

Create or overwrite `vibe-audit.html` at the workspace root. Do not create, edit, or delete any other file. Do not install packages. Do not change application data. Read-only inspection plus that one report is the whole job.

## How to judge

Give every item exactly one status: `pass`, `fail`, or `not_applicable`.

- `pass` means you saw the requirement in this workspace. Cite a file path and what you found. A README promise is not evidence. A framework default is not a custom page.
- `fail` means you looked and the requirement is missing, placeholder, or only a default. Name the paths you checked and say what is missing. Use the words `not found` when nothing is there.
- `not_applicable` means the condition is absent. Say why in the evidence.

`appliesWhen` rules:

- `always`: judge it. Use `not_applicable` only when `howToVerify` itself allows that, such as an app with no images.
- `forms`: `not_applicable` only when there is no form, checkout, or signup.
- `accounts`: `not_applicable` only when there are no accounts or private areas.
- `analytics`: `not_applicable` only when the app uses no analytics and sets no non-essential cookies.
- `payments`: `not_applicable` only when the app does not take payment.
- `blog`: `not_applicable` only when the app does not publish articles or posts.

Severity changes the label, not the status. A recommended item can fail.

If the dev server is off, judge the source. Say that the evidence is from source. Do not fail a check only because you did not click a running page when the source implements it. HTTPS and security headers need a deployment or host config; if neither exists, mark them missing and say that no production URL or header config was found.

Never invent a file. Never paste a secret value into the report. Name the file and the kind of secret only.

## Score

Applicable items are `pass` plus `fail`. `not_applicable` items are left out.

The score is the count of passes divided by the count of applicable items. Also count how many failed items are `required`.

## Report file

Write one self-contained HTML document. Inline the CSS below. Do not load scripts, fonts, or images. Include every checklist item, in category order, under Missing, In place, or Does not apply.

Use this document. Replace the bracketed fields. Repeat one `article` per item. Keep the class names.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preflight report — [Project name]</title>
  <style>
    :root { --paper: #f3eadc; --ink: #1b1612; --muted: #4a433b; --line: #d9cbb6; --pass: #145c38; --miss: #8e2f2a; --na: #5c564e; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; font-size: 1.05rem; line-height: 1.5; }
    main { width: min(820px, calc(100% - 2rem)); margin: 2rem auto 4rem; }
    .kicker, .status, .meta dt, table, .evidence span, footer, .cat { font-family: ui-monospace, "Cascadia Mono", "Segoe UI Mono", Consolas, monospace; }
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
    .status { margin: 0; font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; text-align: right; }
    .finding.pass .status { color: var(--pass); }
    .finding.miss .status { color: var(--miss); }
    .finding.na .status { color: var(--na); }
    .why, .evidence { margin: .35rem 0 0; }
    .evidence span { font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; display: block; color: var(--muted); }
    .evidence { overflow-wrap: anywhere; }
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
    <dl class="meta">
      <div><dt>Project</dt><dd>[Project name from the package, app, or folder]</dd></div>
      <div><dt>Generated</dt><dd>[Date]</dd></div>
      <div><dt>Source</dt><dd>Workspace audit</dd></div>
    </dl>
    <section class="score">
      <p class="fraction">[passes]<span>/[applicable]</span></p>
      <p>[Percent]% of the checks that apply are in place. [Required open count] required items are still open.</p>
    </section>
    <section>
      <h2>By category</h2>
      <table>
        <caption>Results by category</caption>
        <thead>
          <tr><th>Category</th><th>In place</th><th>Missing</th><th>Does not apply</th></tr>
        </thead>
        <tbody>
          <tr><td>[Category]</td><td>[n]</td><td>[n]</td><td>[n]</td></tr>
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
          <p class="status">Missing · Required</p>
        </header>
        <p class="why">[why from the checklist]</p>
        <p class="evidence"><span>Evidence</span>[Where you looked and what you found]</p>
      </article>
    </section>
    <section>
      <h2>In place</h2>
      <article class="finding pass">
        <header>
          <div>
            <p class="cat">[Category title]</p>
            <h3>[Item title]</h3>
          </div>
          <p class="status">In place · Recommended</p>
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
          <p class="status">Does not apply · Required</p>
        </header>
        <p class="why">[why]</p>
        <p class="evidence"><span>Evidence</span>[Why the condition is absent]</p>
      </article>
    </section>
    <footer>Score is items in place divided by items that apply. A pass needs evidence. This file is the report; it leaves the app as it is.</footer>
  </main>
</body>
</html>
```

Escape any HTML characters that came from the workspace so the report stays a document.

## When you finish

Reply with the score, the required items still open, and the path `vibe-audit.html`. Do not start fixing the app.
