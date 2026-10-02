(function () {
  var STORAGE_KEY = "vibe-code-checklist-v1";
  var SURVEY_KEY = "vibe-code-checklist-survey";
  var APPLIES = {
    forms: "If the app has a form, checkout, or signup",
    accounts: "If the app has accounts",
    analytics: "If the app uses analytics or non-essential cookies",
    payments: "If the app takes payment",
    blog: "If the app publishes articles",
    dependencies: "If the app installs packages",
    database: "If the app stores data in a database",
    email: "If the app sends marketing email",
    api: "If the app has an API",
    uploads: "If people can upload files",
    claims: "If the app shows reviews, testimonials, or statistics"
  };

  var REPORT_CSS = [
    ":root{--paper:#f3eadc;--ink:#1b1612;--muted:#4a433b;--line:#d9cbb6;--hl-pass:#b7ebc6;--hl-warn:#ffe56a;--hl-miss:#ffb4ae}",
    "*{box-sizing:border-box}",
    "body{margin:0;background:var(--paper);color:var(--ink);font-family:\"Iowan Old Style\",\"Palatino Linotype\",Palatino,Georgia,serif;font-size:1.05rem;line-height:1.5}",
    "main{width:min(820px,calc(100% - 2rem));margin:2rem auto 4rem}",
    ".kicker,.status,.meta dt,table,.evidence span,.fix span,footer,.cat{font-family:ui-monospace,\"Cascadia Mono\",\"Segoe UI Mono\",Consolas,monospace}",
    ".kicker{letter-spacing:.12em;text-transform:uppercase;font-size:.72rem;margin:0 0 .5rem}",
    "h1{font-size:2.6rem;line-height:1;font-weight:560;margin:0 0 1rem}",
    ".sample-banner{border:1px solid var(--ink);padding:.7rem .8rem}",
    ".meta{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0}",
    ".meta div{border-top:1px solid var(--ink);padding-top:.4rem}",
    ".meta dt{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}",
    ".meta dd{margin:.2rem 0 0}",
    ".score{border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);padding:1rem 0;display:flex;gap:1.5rem;align-items:baseline}",
    ".fraction{font-size:3rem;line-height:1;margin:0;font-variant-numeric:tabular-nums}",
    ".fraction span{font-size:1.25rem;color:var(--muted)}",
    ".score p{margin:0}",
    "table{width:100%;border-collapse:collapse;font-size:.85rem}",
    "caption{text-align:left;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .4rem}",
    "th,td{text-align:left;padding:.45rem .5rem .45rem 0;border-bottom:1px solid var(--line);vertical-align:top}",
    "th:not(:first-child),td:not(:first-child){text-align:right;font-variant-numeric:tabular-nums}",
    "h2{font-size:1.5rem;margin:2rem 0 .6rem}",
    ".finding{border-top:1px solid var(--line);padding:.9rem 0}",
    ".finding header{display:flex;justify-content:space-between;gap:1rem;align-items:baseline}",
    ".finding h3{margin:0;font-size:1.15rem}",
    ".cat{margin:0 0 .15rem;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}",
    ".key{margin:1rem 0 0}",
    ".mark,.status{color:var(--ink);background:transparent;padding:.08em .28em;box-decoration-break:clone;-webkit-box-decoration-break:clone;-webkit-print-color-adjust:exact;print-color-adjust:exact}",
    ".status{margin:0;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;text-align:right;display:inline-block}",
    ".mark.pass,.finding.pass .status{background:var(--hl-pass)}",
    ".mark.warn,.finding.warn .status{background:var(--hl-warn)}",
    ".mark.miss,.finding.miss .status{background:var(--hl-miss)}",
    ".context p{margin:.45rem 0}",
    ".why,.evidence,.fix{margin:.35rem 0 0}",
    ".evidence span,.fix span{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;display:block;color:var(--muted)}",
    ".evidence,.fix{overflow-wrap:anywhere}",
    ".verdict-label{font-size:1.7rem;line-height:1.2;margin:0 0 .4rem;display:inline}",
    ".fix-list{margin:.2rem 0 0;padding-left:1.2rem}",
    ".fix-list li{margin:.45rem 0}",
    "footer{margin-top:2rem;color:var(--muted);font-size:.85rem}",
    "@media(max-width:640px){.meta,.score,.finding header{display:flex;flex-direction:column;align-items:flex-start}h1{font-size:2.1rem}.status{text-align:left}}",
    "@media print{body{background:#fff}main{width:auto;margin:0}}"
  ].join("");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusLabel(status, severity) {
    if (status === "pass") return "Done";
    if (status === "not_applicable") return "Does not apply";
    if (severity === "recommended") return "Warning";
    return "Missing";
  }

  function statusClass(status, severity) {
    if (status === "pass") return "pass";
    if (status === "not_applicable") return "na";
    if (severity === "recommended") return "warn";
    return "miss";
  }

  function overallVerdict(requiredOpen, recommendedOpen, applicable) {
    if (!applicable) {
      return { label: "Nothing to score", detail: "No checks apply to this app." };
    }
    if (requiredOpen === 0 && recommendedOpen === 0) {
      return { label: "Ready to ship", detail: "Every check that applies is in place." };
    }
    if (requiredOpen === 0) {
      return {
        label: "Required checks are in place",
        detail: recommendedOpen + " recommended " + (recommendedOpen === 1 ? "improvement is" : "improvements are") + " still open. The required work is done."
      };
    }
    return {
      label: "Not ready to ship",
      detail: requiredOpen + " required " + (requiredOpen === 1 ? "check is" : "checks are") + " still open. Fix those before you call the app done."
        + (recommendedOpen ? " " + recommendedOpen + " recommended " + (recommendedOpen === 1 ? "item is" : "items are") + " also open." : "")
    };
  }

  function fixFirstHtml(findings, counts) {
    var required = findings.filter(function (finding) {
      return finding.severity === "required" && finding.status !== "pass" && finding.status !== "not_applicable";
    });
    if (!required.length) return "<p>None. No required item is open.</p>";
    return "<ol class=\"fix-list\">" + required.map(function (finding) {
      var categoryTitle = (counts[finding.category] && counts[finding.category].title) || finding.category;
      return "<li><strong>" + escapeHtml(finding.title) + ".</strong> " + escapeHtml(finding.howToFix || "See the missing item below.") + " <span class=\"cat\">" + escapeHtml(categoryTitle) + "</span></li>";
    }).join("") + "</ol>";
  }

  function contextHtml(context) {
    var picture = context || {};
    return "<section class=\"context\"><h2>What this app is</h2>" +
      "<p><strong>Goal.</strong> " + escapeHtml(picture.goal || "Not stated.") + "</p>" +
      "<p><strong>Who it is for.</strong> " + escapeHtml(picture.audience || "Not stated.") + "</p>" +
      "<p><strong>Checks that fit.</strong> " + escapeHtml(picture.needed || "Not stated.") + "</p>" +
      "<p class=\"evidence\"><span>Based on</span>" + escapeHtml(picture.basis || "Not recorded") + "</p></section>";
  }

  function buildReportHtml(options) {
    var findings = options.findings || [];
    var categories = options.categories || [];
    var pass = 0;
    var fail = 0;
    var requiredOpen = 0;
    var recommendedOpen = 0;
    var counts = {};
    categories.forEach(function (category) {
      counts[category.id] = { title: category.title, pass: 0, miss: 0, warn: 0, na: 0 };
    });
    findings.forEach(function (finding) {
      if (!counts[finding.category]) {
        counts[finding.category] = { title: finding.category, pass: 0, miss: 0, warn: 0, na: 0 };
      }
      var bucket = statusClass(finding.status, finding.severity);
      if (bucket === "pass") {
        pass += 1;
        counts[finding.category].pass += 1;
      } else if (bucket === "na") {
        counts[finding.category].na += 1;
      } else if (bucket === "warn") {
        fail += 1;
        recommendedOpen += 1;
        counts[finding.category].warn += 1;
      } else {
        fail += 1;
        requiredOpen += 1;
        counts[finding.category].miss += 1;
      }
    });
    var applicable = pass + fail;
    var percent = applicable ? Math.round((pass / applicable) * 100) : 0;
    var verdict = overallVerdict(requiredOpen, recommendedOpen, applicable);
    var summary = applicable
      ? percent + "% of the checks that apply are in place. " + verdict.detail
      : verdict.detail;
    var used = {};
    findings.forEach(function (finding) { used[finding.category] = true; });
    var categoryRows = categories.filter(function (category) { return used[category.id]; }).map(function (category) {
      var row = counts[category.id];
      return "<tr><td>" + escapeHtml(row.title) + "</td><td>" + row.pass + "</td><td>" + row.miss + "</td><td>" + row.warn + "</td><td>" + row.na + "</td></tr>";
    }).join("");
    var title = options.sampleNote
      ? "Sample preflight report — Vibe Code Checklist"
      : "Preflight report — " + (options.projectName || "Workspace");
    var groups = [
      ["miss", "Missing"],
      ["warn", "Warnings"],
      ["pass", "Done"],
      ["na", "Does not apply"]
    ];
    var sections = groups.map(function (group) {
      var items = findings.filter(function (finding) {
        return statusClass(finding.status, finding.severity) === group[0];
      });
      var body = items.length
        ? items.map(function (finding) {
          var categoryTitle = (counts[finding.category] && counts[finding.category].title) || finding.category;
          var failed = finding.status !== "pass" && finding.status !== "not_applicable";
          var fix = failed && finding.howToFix
            ? "<p class=\"fix\"><span>How to fix</span>" + escapeHtml(finding.howToFix) + "</p>"
            : "";
          var mark = statusClass(finding.status, finding.severity);
          return "<article class=\"finding " + mark + "\"><header><div><p class=\"cat\">" +
            escapeHtml(categoryTitle) + "</p><h3>" + escapeHtml(finding.title) + "</h3></div><p class=\"status\">" +
            statusLabel(finding.status, finding.severity) + "</p></header><p class=\"why\">" + escapeHtml(finding.why) +
            "</p><p class=\"evidence\"><span>Evidence</span>" + escapeHtml(finding.evidence || "Not recorded") + "</p>" + fix + "</article>";
        }).join("")
        : "<p>None.</p>";
      return "<section><h2>" + group[1] + "</h2>" + body + "</section>";
    }).join("");
    var verdictMark = !applicable ? "" : requiredOpen ? "miss" : recommendedOpen ? "warn" : "pass";
    return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
      "<title>" + escapeHtml(title) + "</title><style>" + REPORT_CSS + "</style></head><body><main>" +
      "<p class=\"kicker\">Vibe Code Checklist</p><h1>Preflight report</h1>" +
      (options.sampleNote ? "<p class=\"sample-banner\">" + escapeHtml(options.sampleNote) + "</p>" : "") +
      "<p class=\"key\"><span class=\"mark pass\">Done</span> already works. <span class=\"mark warn\">Warning</span> can wait. <span class=\"mark miss\">Missing</span> needs a fix before you ship.</p>" +
      "<dl class=\"meta\"><div><dt>Project</dt><dd>" + escapeHtml(options.projectName || "Workspace") + "</dd></div>" +
      "<div><dt>Generated</dt><dd>" + escapeHtml(options.generatedOn || "") + "</dd></div>" +
      "<div><dt>Source</dt><dd>" + escapeHtml(options.source || "Workspace audit") + "</dd></div></dl>" +
      contextHtml(options.context) +
      "<section class=\"score\"><p class=\"fraction\">" + pass + "<span>/" + applicable + "</span></p><p>" + escapeHtml(summary) + "</p></section>" +
      "<section class=\"verdict\"><h2>Overall</h2><p class=\"verdict-label mark " + verdictMark + "\">" + escapeHtml(verdict.label) + "</p><p>" + escapeHtml(verdict.detail) + "</p></section>" +
      "<section><h2>Fix these first</h2>" + fixFirstHtml(findings, counts) + "</section>" +
      "<section><h2>By category</h2><table><caption>Results by category</caption><thead><tr><th>Category</th><th>Done</th><th>Missing</th><th>Warning</th><th>Does not apply</th></tr></thead><tbody>" +
      categoryRows + "</tbody></table></section>" + sections +
      "<footer>The score counts checks that are done, out of the checks that apply. A warning still counts. Something that does not apply does not. This file is the report. It does not change the app.</footer>" +
      "</main></body></html>";
  }

  function loadState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function itemStatus(item, state) {
    if (state[item.id] === "na" && item.appliesWhen !== "always") return "na";
    if (state[item.id] === "pass") return "pass";
    return "open";
  }

  function summarize(items, state) {
    var pass = 0;
    var open = 0;
    var na = 0;
    var requiredOpen = 0;
    items.forEach(function (item) {
      var status = itemStatus(item, state);
      if (status === "na") na += 1;
      else if (status === "pass") pass += 1;
      else {
        open += 1;
        if (item.severity === "required") requiredOpen += 1;
      }
    });
    return { pass: pass, open: open, na: na, requiredOpen: requiredOpen, applicable: pass + open };
  }

  function renderScore(items, state) {
    var score = summarize(items, state);
    document.getElementById("score-pass").textContent = String(score.pass);
    document.getElementById("score-of").textContent = "/" + score.applicable;
    document.getElementById("score-note").textContent = score.pass + " in place · " + score.open + " open · " + score.na + " set aside";
    var recommendedOpen = score.open - score.requiredOpen;
    var verdict = overallVerdict(score.requiredOpen, recommendedOpen, score.applicable);
    document.getElementById("score-required").textContent = verdict.label + ". " + verdict.detail;
  }

  function paintRow(row, item, state) {
    var status = itemStatus(item, state);
    row.classList.toggle("is-pass", status === "pass");
    row.classList.toggle("is-na", status === "na");
    var box = row.querySelector("input");
    box.checked = status === "pass";
    box.disabled = status === "na";
    var label = row.querySelector(".row-status");
    label.className = "row-status" + (status === "pass" ? " pass" : "");
    label.textContent = status === "pass" ? "In place" : status === "na" ? "Set aside" : "Open";
    var toggle = row.querySelector(".na-toggle");
    if (toggle) toggle.textContent = status === "na" ? "It applies" : "Doesn't apply";
  }

  function renderList(data, state) {
    var list = document.getElementById("list");
    list.replaceChildren();
    if (!data.items.length) {
      list.appendChild(el("p", "load-error", "This edition of the checklist has no items."));
      return;
    }
    data.categories.forEach(function (category) {
      var items = data.items.filter(function (item) { return item.category === category.id; });
      if (!items.length) return;
      var section = el("section", "category");
      section.appendChild(el("h2", null, category.title));
      section.appendChild(el("p", "category-summary", category.summary));
      items.forEach(function (item) {
        var row = el("article", "item");
        var box = document.createElement("input");
        box.type = "checkbox";
        box.id = "check-" + item.id;
        var body = el("div", "item-body");
        var titleRow = el("div", "item-title-row");
        var label = el("label", null, item.title);
        label.htmlFor = box.id;
        var badge = el("span", "badge " + item.severity, item.severity === "required" ? "Required" : "Recommended");
        titleRow.appendChild(label);
        titleRow.appendChild(badge);
        body.appendChild(titleRow);
        if (APPLIES[item.appliesWhen]) body.appendChild(el("p", "when", APPLIES[item.appliesWhen]));
        body.appendChild(el("p", "why", item.why));
        var details = el("details");
        details.appendChild(el("summary", null, "How to check and fix"));
        details.appendChild(el("p", "how", item.howToVerify));
        if (item.howToFix) {
          var fix = el("p", "how");
          var lead = el("strong", null, "Fix: ");
          fix.appendChild(lead);
          fix.appendChild(document.createTextNode(item.howToFix));
          details.appendChild(fix);
        }
        body.appendChild(details);
        if (item.appliesWhen !== "always") {
          var toggle = el("button", "na-toggle");
          toggle.type = "button";
          toggle.addEventListener("click", function () {
            if (itemStatus(item, state) === "na") delete state[item.id];
            else state[item.id] = "na";
            saveState(state);
            paintRow(row, item, state);
            renderScore(data.items, state);
          });
          body.appendChild(toggle);
        }
        box.addEventListener("change", function () {
          if (box.checked) state[item.id] = "pass";
          else delete state[item.id];
          saveState(state);
          paintRow(row, item, state);
          renderScore(data.items, state);
        });
        var status = el("p", "row-status", "Open");
        row.appendChild(box);
        row.appendChild(body);
        row.appendChild(status);
        paintRow(row, item, state);
        section.appendChild(row);
      });
      list.appendChild(section);
    });
  }

  function findingsFromState(data, state) {
    return data.items.map(function (item) {
      var status = itemStatus(item, state);
      var reportStatus = status === "pass" ? "pass" : status === "na" ? "not_applicable" : "fail";
      var evidence = reportStatus === "pass"
        ? "Marked in place by hand. This is a self-check, not a file inspection."
        : reportStatus === "not_applicable"
          ? "Marked as not applicable by hand."
          : "Left open on the self-check.";
      return {
        id: item.id,
        category: item.category,
        title: item.title,
        severity: item.severity,
        why: item.why,
        status: reportStatus,
        evidence: evidence,
        howToFix: item.howToFix
      };
    });
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function showLoadError() {
    var list = document.getElementById("list");
    list.replaceChildren();
    list.appendChild(el("p", "load-error", "The checklist did not load. Refresh the page. If you opened the file directly, serve this folder over HTTP so checklist.json can be read."));
    document.getElementById("score-note").textContent = "The checklist did not load.";
    document.getElementById("score-required").textContent = "";
  }

  function promptText() {
    return document.getElementById("prompt-text").textContent.replace(/^\n/, "").trim();
  }

  async function onCopy() {
    var button = document.getElementById("copy");
    var text = promptText();
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
    } catch (error) {
      var range = document.createRange();
      range.selectNodeContents(document.getElementById("prompt-text"));
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Selected — press Ctrl+C";
    }
    window.setTimeout(function () { button.textContent = "Copy prompt"; }, 2000);
  }

  function readSurvey() {
    try {
      var parsed = JSON.parse(localStorage.getItem(SURVEY_KEY) || "null");
      return parsed && parsed.done ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function applySurvey(items, state, answers) {
    var managed = ["accounts", "forms", "payments", "blog", "analytics", "uploads", "email", "claims"];
    items.forEach(function (item) {
      if (managed.indexOf(item.appliesWhen) === -1) return;
      var active = item.appliesWhen === "forms" ? !!(answers.forms || answers.accounts) : !!answers[item.appliesWhen];
      if (active) {
        if (state[item.id] === "na") delete state[item.id];
      } else {
        state[item.id] = "na";
      }
    });
    saveState(state);
  }

  function surveyContext(answers) {
    var labels = {
      forms: "a form",
      payments: "payments",
      blog: "a blog",
      analytics: "analytics",
      uploads: "uploads",
      email: "email updates",
      claims: "reviews or stats"
    };
    var audience = {
      public: "Anyone on the web.",
      accounts: "People who sign in.",
      private: "Only the person who built it."
    }[answers.who] || "Chosen in the short survey.";
    var picked = Object.keys(labels).filter(function (key) { return answers[key]; }).map(function (key) { return labels[key]; });
    if (answers.accounts) picked.unshift("sign-in");
    var goal = picked.length ? "It includes " + picked.join(", ") + "." : "It has none of the extra features.";
    if (answers.accounts && !answers.forms) goal += " Sign-in keeps the form checks.";
    return {
      goal: goal,
      audience: audience,
      needed: goal + " Anything left off is set aside.",
      basis: "Short answers on the check page, not a file inspection."
    };
  }

  function collectSurvey() {
    var who = document.querySelector("#survey input[name='who']:checked");
    var pay = document.querySelector("#survey input[name='pay']:checked");
    var answers = {
      done: true,
      who: who ? who.value : "public",
      pay: pay ? pay.value : "no",
      accounts: !!(who && who.value === "accounts"),
      payments: !!(pay && pay.value === "yes")
    };
    document.querySelectorAll("#survey input[name='extra']").forEach(function (box) {
      answers[box.value] = box.checked;
    });
    return answers;
  }

  function fillSurvey(answers) {
    var who = answers.who || (answers.accounts ? "accounts" : "public");
    var pay = answers.pay || (answers.payments ? "yes" : "no");
    var whoInput = document.querySelector("#survey input[name='who'][value='" + who + "']");
    var payInput = document.querySelector("#survey input[name='pay'][value='" + pay + "']");
    if (whoInput) whoInput.checked = true;
    if (payInput) payInput.checked = true;
    document.querySelectorAll("#survey input[name='extra']").forEach(function (box) {
      box.checked = !!answers[box.value];
    });
  }

  function showSurvey() {
    document.getElementById("survey").hidden = false;
    document.getElementById("checklist").hidden = true;
  }

  function showList() {
    document.getElementById("survey").hidden = true;
    document.getElementById("checklist").hidden = false;
  }

  function init() {
    var copy = document.getElementById("copy");
    if (copy) copy.addEventListener("click", onCopy);
    if (!document.getElementById("list")) return;
    fetch("checklist.json")
      .then(function (response) {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(function (data) {
        var state = loadState();
        var saved = readSurvey();
        function refresh(answers) {
          applySurvey(data.items, state, answers);
          renderList(data, state);
          renderScore(data.items, state);
        }
        if (saved) {
          fillSurvey(saved);
          refresh(saved);
          showList();
        }
        document.getElementById("download").disabled = false;
        document.getElementById("reset").disabled = false;
        document.getElementById("survey-start").addEventListener("click", function () {
          var answers = collectSurvey();
          localStorage.setItem(SURVEY_KEY, JSON.stringify(answers));
          refresh(answers);
          showList();
          document.getElementById("checklist-title").focus();
        });
        document.getElementById("survey-edit").addEventListener("click", showSurvey);
        document.getElementById("download").addEventListener("click", function () {
          var answers = readSurvey() || collectSurvey();
          var html = buildReportHtml({
            projectName: "Manual review",
            generatedOn: formatDate(new Date()),
            source: "Marked by hand in the browser",
            context: surveyContext(answers),
            categories: data.categories,
            findings: findingsFromState(data, state)
          });
          var blob = new Blob([html], { type: "text/html" });
          var url = URL.createObjectURL(blob);
          var link = document.createElement("a");
          link.href = url;
          link.download = "vibe-audit.html";
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        });
        document.getElementById("reset").addEventListener("click", function () {
          if (!window.confirm("Clear every check in this browser?")) return;
          Object.keys(state).forEach(function (key) { delete state[key]; });
          var answers = readSurvey() || collectSurvey();
          refresh(answers);
        });
      })
      .catch(showLoadError);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildReportHtml: buildReportHtml };
  }

  if (typeof document !== "undefined") init();
})();
