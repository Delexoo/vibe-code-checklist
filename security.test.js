const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const app = require("./app.js");

const root = __dirname;
let checks = 0;

function check(name, fn) {
  fn();
  checks += 1;
  console.log("ok " + name);
}

function read(name) {
  return fs.readFileSync(path.join(root, name), "utf8");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("base64");
}

check("real checklist shape is accepted", function () {
  assert.strictEqual(app.isChecklist(JSON.parse(read("checklist.json"))), true);
});

check("checklist shape rejects hostile items", function () {
  const data = JSON.parse(read("checklist.json"));
  const brokenId = JSON.parse(JSON.stringify(data));
  brokenId.items[0].id = "x\"><img src=x onerror=alert(1)>";
  assert.strictEqual(app.isChecklist(brokenId), false);

  const brokenTitle = JSON.parse(JSON.stringify(data));
  brokenTitle.items[0].title = { html: "<script>alert(1)</script>" };
  assert.strictEqual(app.isChecklist(brokenTitle), false);

  const brokenSeverity = JSON.parse(JSON.stringify(data));
  brokenSeverity.items[0].severity = "admin";
  assert.strictEqual(app.isChecklist(brokenSeverity), false);

  assert.strictEqual(app.isChecklist({ categories: [], items: {} }), false);
  assert.strictEqual(app.isChecklist(null), false);
});

check("saved ticks keep only pass or na", function () {
  assert.deepStrictEqual(app.sanitizeState({
    "custom-404": "pass",
    "no-secrets": "na",
    "custom-404<script>": "pass",
    "debug-off": "<script>alert(1)</script>",
    "__proto__": "pass",
    constructor: "na",
    prototype: "pass"
  }), {
    "custom-404": "pass",
    "no-secrets": "na"
  });
  assert.deepStrictEqual(app.sanitizeState(["pass"]), {});
  assert.deepStrictEqual(app.sanitizeState(null), {});
});

check("survey answers stay on the allowlist", function () {
  const poisoned = app.sanitizeSurvey({
    done: true,
    who: "public'><img src=x onerror=alert(1)>",
    pay: "yes",
    accounts: true,
    payments: false,
    forms: "true",
    uploads: true,
    admin: true
  });
  assert.strictEqual(poisoned.who, "public");
  assert.strictEqual(poisoned.pay, "yes");
  assert.strictEqual(poisoned.accounts, false);
  assert.strictEqual(poisoned.payments, true);
  assert.strictEqual(poisoned.forms, false);
  assert.strictEqual(poisoned.uploads, true);
  assert.strictEqual(Object.prototype.hasOwnProperty.call(poisoned, "admin"), false);
  assert.strictEqual(app.sanitizeSurvey({ done: false, who: "accounts" }), null);
  assert.strictEqual(app.sanitizeSurvey(null), null);
});

check("commit dates are strict timestamps", function () {
  const good = app.commitStamp({ commit: { committer: { date: "2026-11-03T05:58:00Z" } } });
  assert.strictEqual(good, "2026-11-03T05:58:00.000Z");
  assert.strictEqual(app.commitStamp({ commit: { committer: { date: "2026-11-03T05:58:00.000Z" } } }), "2026-11-03T05:58:00.000Z");
  assert.strictEqual(app.commitStamp({ commit: { committer: { date: "<script>alert(1)</script>" } } }), "");
  assert.strictEqual(app.commitStamp({ commit: { committer: { date: "2026-11-03T05:58:00+00:00" } } }), "");
  assert.strictEqual(app.commitStamp({}), "");
});

check("downloaded report cannot carry markup", function () {
  const payload = "<script>alert(1)</script><img src=x onerror=\"alert(1)\">';alert(1)//";
  const html = app.buildReportHtml({
    projectName: payload,
    generatedOn: payload,
    source: payload,
    sampleNote: payload,
    context: { goal: payload, audience: payload, needed: payload, basis: payload },
    categories: [{ id: "security", title: payload, summary: payload }],
    findings: [{
      id: "xss",
      category: "security",
      title: payload,
      severity: "required",
      why: payload,
      status: "fail",
      evidence: payload,
      howToFix: payload
    }]
  });
  assert.strictEqual(html.includes("<script"), false);
  assert.strictEqual(html.includes("<img"), false);
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(html.includes("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&#39;;alert(1)//"));
  assert.ok(html.includes("script-src 'none'"));
  assert.ok(html.includes("name=\"referrer\" content=\"no-referrer\""));
  const tags = html.match(/<\/?[a-zA-Z0-9!]+/g) || [];
  const allowed = {
    "<!DOCTYPE": true, "<html": true, "<head": true, "<meta": true, "<title": true, "</title": true,
    "<style": true, "</style": true, "</head": true, "<body": true, "<main": true, "<p": true, "</p": true,
    "<span": true, "</span": true, "<dl": true, "<div": true, "<dt": true, "</dt": true, "<dd": true, "</dd": true,
    "</div": true, "</dl": true, "<section": true, "<h1": true, "</h1": true, "<h2": true, "</h2": true,
    "<ol": true, "<li": true, "<strong": true, "</strong": true, "</li": true, "</ol": true, "</section": true,
    "<table": true, "<caption": true, "</caption": true, "<thead": true, "<tr": true, "<th": true, "</th": true,
    "<td": true, "</td": true,
    "</tr": true, "</thead": true, "<tbody": true, "</tbody": true, "</table": true, "<article": true,
    "<header": true, "</header": true, "<h3": true, "</h3": true, "</article": true, "<footer": true, "</footer": true,
    "</main": true, "</body": true, "</html": true
  };
  tags.forEach(function (tag) {
    assert.ok(allowed[tag], "unexpected tag " + tag);
  });
});

check("pages lock scripts styles and referrals", function () {
  const pages = {
    "index.html": "script-src 'sha256-",
    "check.html": "script-src 'self'",
    "prompt.html": "https://api.github.com",
    "privacy.html": "script-src 'none'",
    "terms.html": "script-src 'none'",
    "404.html": "script-src 'none'",
    "sample-report.html": "script-src 'none'"
  };
  Object.keys(pages).forEach(function (name) {
    const html = read(name);
    assert.ok(html.indexOf(pages[name]) !== -1, name + " missing " + pages[name]);
    assert.ok(html.includes('name="referrer" content="no-referrer"'), name);
    assert.ok(html.includes("upgrade-insecure-requests"), name);
    assert.ok(html.includes("base-uri 'none'"), name);
    assert.ok(html.includes("object-src 'none'"), name);
    assert.strictEqual(html.includes("unsafe-inline"), false, name);
    assert.strictEqual(html.includes("unsafe-eval"), false, name);
  });

  const indexScript = read("index.html").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(indexScript);
  assert.ok(read("index.html").includes("sha256-" + sha256(indexScript[1])));

  const sampleStyle = read("sample-report.html").match(/<style>([\s\S]*?)<\/style>/);
  assert.ok(sampleStyle);
  assert.ok(read("sample-report.html").includes("sha256-" + sha256(sampleStyle[1])));
});

check("client script does not use injection sinks", function () {
  const source = read("app.js");
  ["innerHTML", "outerHTML", "document.write", "document.cookie", "eval(", "new Function", "insertAdjacentHTML"].forEach(function (sink) {
    assert.strictEqual(source.includes(sink), false, sink);
  });
  assert.ok(source.includes('credentials: "omit"'));
  assert.ok(source.includes('referrerPolicy: "no-referrer"'));
  assert.ok(source.includes("COMMIT_MIN_INTERVAL_MS"));
  assert.ok(source.includes("CHECKLIST_MAX_CHARS"));
});

check("ignore rules cover secret files", function () {
  const ignore = read(".gitignore");
  [".env", "*.pem", "*.key", "credentials.json", "id_rsa", ".aws/", ".ssh/", "secrets.json"].forEach(function (rule) {
    assert.ok(ignore.includes(rule), rule);
  });
});

check("tracked text has no secret material or remote scripts", function () {
  const tracked = execFileSync("git", ["-c", "safe.directory=*", "ls-files", "-z"], { cwd: root }).toString().split("\0").filter(Boolean);
  const secret = /AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|sk_live_[A-Za-z0-9]+|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|xox[baprs]-[A-Za-z0-9-]+/;
  assert.ok(tracked.includes("app.js"));
  assert.strictEqual(tracked.includes(".env"), false);
  tracked.forEach(function (name) {
    if (name === "security.test.js") return;
    const text = read(name);
    assert.strictEqual(secret.test(text), false, name);
    assert.strictEqual(text.includes("GITHUB_TOKEN"), false, name);
    if (name.endsWith(".html") || name.endsWith(".js") || name.endsWith(".css")) {
      assert.strictEqual(text.includes("http://"), false, name);
      assert.strictEqual(/src=["']https?:/i.test(text), false, name);
    }
  });
  if (fs.existsSync(path.join(root, ".env"))) {
    const ignored = execFileSync("git", ["-c", "safe.directory=*", "check-ignore", ".env"], { cwd: root }).toString().trim();
    assert.strictEqual(ignored, ".env");
  }
});

console.log(checks + " checks passed");
