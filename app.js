(function () {
  var STORAGE_KEY = "vibe-code-checklist-v1";
  var PROJECT_KEY = "vibe-code-checklist-project";
  var APPLIES = {
    forms: "If the app has a form, checkout, or signup",
    accounts: "If the app has accounts",
    analytics: "If the app uses analytics or non-essential cookies",
    payments: "If the app takes payment",
    blog: "If the app publishes articles"
  };

  var REPORT_CSS = [
    ":root{--paper:#f3eadc;--ink:#1b1612;--muted:#4a433b;--line:#d9cbb6;--pass:#145c38;--miss:#8e2f2a;--na:#5c564e}",
    "*{box-sizing:border-box}",
    "body{margin:0;background:var(--paper);color:var(--ink);font-family:\"Iowan Old Style\",\"Palatino Linotype\",Palatino,Georgia,serif;font-size:1.05rem;line-height:1.5}",
    "main{width:min(820px,calc(100% - 2rem));margin:2rem auto 4rem}",
    ".kicker,.status,.meta dt,table,.evidence span,footer,.cat{font-family:ui-monospace,\"Cascadia Mono\",\"Segoe UI Mono\",Consolas,monospace}",
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
    ".status{margin:0;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;text-align:right}",
    ".finding.pass .status{color:var(--pass)}",
    ".finding.miss .status{color:var(--miss)}",
    ".finding.na .status{color:var(--na)}",
    ".why,.evidence{margin:.35rem 0 0}",
    ".evidence span{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;display:block;color:var(--muted)}",
    ".evidence{overflow-wrap:anywhere}",
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

  function statusLabel(status) {
    if (status === "pass") return "In place";
    if (status === "not_applicable") return "Does not apply";
    return "Missing";
  }

  function statusClass(status) {
    if (status === "pass") return "pass";
    if (status === "not_applicable") return "na";
    return "miss";
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
      counts[category.id] = { title: category.title, pass: 0, fail: 0, na: 0 };
    });
    findings.forEach(function (finding) {
      if (!counts[finding.category]) {
        counts[finding.category] = { title: finding.category, pass: 0, fail: 0, na: 0 };
      }
      if (finding.status === "pass") {
        pass += 1;
        counts[finding.category].pass += 1;
      } else if (finding.status === "not_applicable") {
        counts[finding.category].na += 1;
      } else {
        fail += 1;
        counts[finding.category].fail += 1;
        if (finding.severity === "required") requiredOpen += 1;
        else recommendedOpen += 1;
      }
    });
    var applicable = pass + fail;
    var percent = applicable ? Math.round((pass / applicable) * 100) : 0;
    var summary = applicable
      ? percent + "% of the checks that apply are in place."
      : "No checks apply.";
    if (applicable) {
      summary += requiredOpen
        ? " " + requiredOpen + " required " + (requiredOpen === 1 ? "item is" : "items are") + " still open."
        : " Every required item that applies is in place.";
      if (recommendedOpen) {
        summary += " " + recommendedOpen + " recommended " + (recommendedOpen === 1 ? "item is" : "items are") + " still open.";
      }
    }
    var used = {};
    findings.forEach(function (finding) { used[finding.category] = true; });
    var categoryRows = categories.filter(function (category) { return used[category.id]; }).map(function (category) {
      var row = counts[category.id];
      return "<tr><td>" + escapeHtml(row.title) + "</td><td>" + row.pass + "</td><td>" + row.fail + "</td><td>" + row.na + "</td></tr>";
    }).join("");
    var title = options.sampleNote
      ? "Sample preflight report — Vibe Code Checklist"
      : "Preflight report — " + (options.projectName || "Workspace");
    var groups = [
      ["fail", "Missing", "miss"],
      ["pass", "In place", "pass"],
      ["not_applicable", "Does not apply", "na"]
    ];
    var sections = groups.map(function (group) {
      var items = findings.filter(function (finding) {
        return group[0] === "fail" ? finding.status !== "pass" && finding.status !== "not_applicable" : finding.status === group[0];
      });
      var body = items.length
        ? items.map(function (finding) {
          var categoryTitle = (counts[finding.category] && counts[finding.category].title) || finding.category;
          var severity = finding.severity === "recommended" ? "Recommended" : "Required";
          return "<article class=\"finding " + statusClass(finding.status) + "\"><header><div><p class=\"cat\">" +
            escapeHtml(categoryTitle) + "</p><h3>" + escapeHtml(finding.title) + "</h3></div><p class=\"status\">" +
            statusLabel(finding.status) + " · " + severity + "</p></header><p class=\"why\">" + escapeHtml(finding.why) +
            "</p><p class=\"evidence\"><span>Evidence</span>" + escapeHtml(finding.evidence || "Not recorded") + "</p></article>";
        }).join("")
        : "<p>None.</p>";
      return "<section><h2>" + group[1] + "</h2>" + body + "</section>";
    }).join("");
    return "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
      "<title>" + escapeHtml(title) + "</title><style>" + REPORT_CSS + "</style></head><body><main>" +
      "<p class=\"kicker\">Vibe Code Checklist</p><h1>Preflight report</h1>" +
      (options.sampleNote ? "<p class=\"sample-banner\">" + escapeHtml(options.sampleNote) + "</p>" : "") +
      "<dl class=\"meta\"><div><dt>Project</dt><dd>" + escapeHtml(options.projectName || "Workspace") + "</dd></div>" +
      "<div><dt>Generated</dt><dd>" + escapeHtml(options.generatedOn || "") + "</dd></div>" +
      "<div><dt>Source</dt><dd>" + escapeHtml(options.source || "Workspace audit") + "</dd></div></dl>" +
      "<section class=\"score\"><p class=\"fraction\">" + pass + "<span>/" + applicable + "</span></p><p>" + escapeHtml(summary) + "</p></section>" +
      "<section><h2>By category</h2><table><caption>Results by category</caption><thead><tr><th>Category</th><th>In place</th><th>Missing</th><th>Does not apply</th></tr></thead><tbody>" +
      categoryRows + "</tbody></table></section>" + sections +
      "<footer>Score is items in place divided by items that apply. A pass needs evidence. This file is the report; it leaves the app as it is.</footer>" +
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
    document.getElementById("score-required").textContent = score.requiredOpen
      ? score.requiredOpen + " required " + (score.requiredOpen === 1 ? "check is" : "checks are") + " still open."
      : "Every required check that applies is in place.";
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
        details.appendChild(el("summary", null, "How to verify"));
        details.appendChild(el("p", "how", item.howToVerify));
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
        evidence: evidence
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

  function init() {
    document.getElementById("copy").addEventListener("click", onCopy);
    var project = document.getElementById("project-name");
    project.value = localStorage.getItem(PROJECT_KEY) || "";
    project.addEventListener("input", function () {
      localStorage.setItem(PROJECT_KEY, project.value);
    });
    fetch("checklist.json")
      .then(function (response) {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(function (data) {
        var state = loadState();
        renderList(data, state);
        renderScore(data.items, state);
        document.getElementById("download").disabled = false;
        document.getElementById("reset").disabled = false;
        document.getElementById("download").addEventListener("click", function () {
          var name = project.value.trim() || "Manual review";
          var html = buildReportHtml({
            projectName: name,
            generatedOn: formatDate(new Date()),
            source: "Marked by hand in the browser",
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
          saveState(state);
          document.querySelectorAll(".item").forEach(function (row) {
            var id = row.querySelector("input").id.replace(/^check-/, "");
            var item = data.items.find(function (entry) { return entry.id === id; });
            if (item) paintRow(row, item, state);
          });
          renderScore(data.items, state);
        });
      })
      .catch(showLoadError);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildReportHtml: buildReportHtml };
  }

  if (typeof document !== "undefined") init();
})();
