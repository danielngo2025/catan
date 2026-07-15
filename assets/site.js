// Shared chrome: builds the nav, wires GoatCounter, and renders public view counters.
// Depends on window.SITE from config.js.
(function () {
  var SITE = window.SITE || { topics: [], goatcounterCode: "" };

  // Current filename (for nav active-state) + the real path GoatCounter records.
  var file = (location.pathname.split("/").pop() || "index.html");
  if (file === "" || file === "index.html") file = "index.html";
  var realPath = location.pathname;                 // exactly what count.js records (e.g. /catan/goal.html)
  var basedir = realPath.replace(/[^\/]*$/, "");    // directory the site is served from (e.g. /catan/)

  // --- nav bar (grouped dropdown menus) ---
  function buildNav() {
    var host = document.getElementById("site-nav");
    if (!host) return;
    // bucket topics by group, preserving first-seen group order
    var order = [], byGroup = {};
    SITE.topics.forEach(function (t) {
      var g = t.group || "More";
      if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(t);
    });
    var groups = order.map(function (g) {
      var items = byGroup[g].map(function (t) {
        var active = t.path === file ? " active" : "";
        return '<a class="navlink' + active + '" href="' + t.path + '">' + t.emoji + " " + t.title + "</a>";
      }).join("");
      var here = byGroup[g].some(function (t) { return t.path === file; }) ? " active" : "";
      return '<div class="navgroup">' +
        '<button class="navbtn' + here + '" type="button">' + g + ' <span class="caret">▾</span></button>' +
        '<div class="navmenu">' + items + '</div>' +
      '</div>';
    }).join("");
    host.innerHTML =
      '<nav class="nav">' +
        '<a class="brand" href="index.html">◈ ' + (SITE.name.split(" ")[0] || "Visual") +
          ' <span>' + SITE.name.split(" ").slice(1).join(" ") + "</span></a>" +
        '<div class="navlinks">' + groups + "</div>" +
        '<div class="spacer"></div>' +
      "</nav>";

    // click a group to toggle its menu; click elsewhere (or another group) closes it
    var navgroups = host.querySelectorAll(".navgroup");
    function closeAll() { navgroups.forEach(function (n) { n.classList.remove("open"); }); }
    navgroups.forEach(function (n) {
      n.querySelector(".navbtn").addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = n.classList.contains("open");
        closeAll();
        if (!wasOpen) n.classList.add("open");
      });
    });
    document.addEventListener("click", closeAll);
  }

  // --- GoatCounter ---
  function loadAnalytics() {
    var code = SITE.goatcounterCode;
    if (!code) return; // analytics not configured yet — no-op
    // No path override: let count.js record location.pathname so it matches what we query below.
    var s = document.createElement("script");
    s.async = true;
    s.src = "//gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
    document.head.appendChild(s);
  }

  // Fetch a public counter (requires "Allow visitor counter" enabled in GoatCounter settings).
  // pathOrTotal: a normalized path like "/goal.html", or "TOTAL" for the whole site.
  function fetchCount(pathOrTotal) {
    var code = SITE.goatcounterCode;
    if (!code) return Promise.reject("no-code");
    var key = pathOrTotal === "TOTAL" ? "TOTAL" : encodeURIComponent(pathOrTotal);
    // start= a date before the site existed → all-time count (the endpoint defaults to a narrow window).
    var url = "https://" + code + ".goatcounter.com/counter/" + key + ".json?start=2020-01-01";
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) { return d.count; }); // already comma-formatted, e.g. "1,234"
  }

  // Per-idea view counts are intentionally not displayed — keep any counter elements hidden.
  // (Pageview tracking via GoatCounter still runs; only the on-page count badges are removed.)
  function renderCounts() {
    document.querySelectorAll("[data-count-path]").forEach(function (el) { el.style.display = "none"; });
  }

  // --- Expert feedback widget (topic pages only; corrections are emailed, never shown on the site) ---
  function injectFeedback() {
    if (file === "index.html") return;                 // per-idea only
    var key = SITE.web3formsKey;
    if (!key) return;
    var topic = SITE.topics.filter(function (t) { return t.path === file; })[0];
    var title = topic ? topic.title : (document.title || "").split(" ·")[0];
    var wrap = document.createElement("div");
    wrap.className = "fb-wrap";
    wrap.innerHTML =
      '<button class="fb-btn" id="fb-open">💬 Expert feedback</button>' +
      '<div class="fb-panel" id="fb-panel" hidden>' +
        '<div class="fb-head"><span>Expert feedback</span><button class="fb-x" id="fb-x" aria-label="Close">✕</button></div>' +
        '<div id="fb-body">' +
          '<p class="fb-note">See something wrong in the explanation or visualization for <b>' + title +
            '</b>? Send a correction — it goes to me privately and is never posted on the site.</p>' +
          '<input class="fb-in" id="fb-name" placeholder="Your name / credentials (optional)">' +
          '<textarea class="fb-in fb-text" id="fb-text" rows="5" placeholder="What is incorrect, and what should it say instead?"></textarea>' +
          '<div class="fb-actions"><button class="fb-send" id="fb-send">Send</button></div>' +
        '</div>' +
        '<div class="fb-done" id="fb-done" hidden></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var panel = document.getElementById("fb-panel");
    var body = document.getElementById("fb-body");
    var done = document.getElementById("fb-done");
    var sendBtn = document.getElementById("fb-send");
    document.getElementById("fb-open").onclick = function () {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) document.getElementById("fb-text").focus();
    };
    document.getElementById("fb-x").onclick = function () { panel.hidden = true; };
    sendBtn.onclick = function () {
      var txt = document.getElementById("fb-text").value.trim();
      if (!txt) { document.getElementById("fb-text").focus(); return; }
      var name = document.getElementById("fb-name").value.trim();
      sendBtn.disabled = true; sendBtn.textContent = "Sending…";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: "Expert Feedback: " + title,
          from_name: name || "Anonymous expert",
          idea: title,
          page_url: location.href,
          message: txt,
          botcheck: false                              // Web3Forms honeypot
        })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.success) throw new Error((d && d.message) || "failed");
        body.hidden = true;
        done.className = "fb-done ok"; done.textContent = "✅ Thanks! Your correction was sent.";
        done.hidden = false;
      }).catch(function () {
        sendBtn.disabled = false; sendBtn.textContent = "Send";
        done.className = "fb-done err"; done.textContent = "⚠️ Couldn't send — please check your connection and try again.";
        done.hidden = false;
      });
    };
  }

  window.LAB = { fetchCount: fetchCount, renderCounts: renderCounts, path: realPath, basedir: basedir };

  buildNav();
  injectFeedback();
  loadAnalytics();
  if (document.readyState !== "loading") renderCounts();
  else document.addEventListener("DOMContentLoaded", renderCounts);
})();
