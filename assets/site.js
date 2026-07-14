// Shared chrome: builds the nav, wires GoatCounter, and renders public view counters.
// Depends on window.SITE from config.js.
(function () {
  var SITE = window.SITE || { topics: [], goatcounterCode: "" };

  // Normalized page path, independent of whether the site is served from / or /catan/.
  var file = (location.pathname.split("/").pop() || "index.html");
  if (file === "" || file === "index.html") file = "index.html";
  var normPath = file === "index.html" ? "/" : "/" + file;

  // --- nav bar ---
  function buildNav() {
    var host = document.getElementById("site-nav");
    if (!host) return;
    var links = SITE.topics.map(function (t) {
      var active = t.path === file ? " active" : "";
      return '<a class="navlink' + active + '" href="' + t.path + '">' + t.emoji + " " + t.title + "</a>";
    }).join("");
    host.innerHTML =
      '<nav class="nav">' +
        '<a class="brand" href="index.html">◈ ' + (SITE.name.split(" ")[0] || "Visual") +
          ' <span>' + SITE.name.split(" ").slice(1).join(" ") + "</span></a>" +
        '<div class="navlinks">' + links + "</div>" +
        '<div class="spacer"></div>' +
      "</nav>";
  }

  // --- GoatCounter ---
  function loadAnalytics() {
    var code = SITE.goatcounterCode;
    if (!code) return; // analytics not configured yet — no-op
    window.goatcounter = { path: function () { return normPath; } };
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
    var url = "https://" + code + ".goatcounter.com/counter/" + key + ".json";
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) { return d.count; }); // already comma-formatted, e.g. "1,234"
  }

  // Fill any [data-count-path] element with its view count; hide on failure.
  function renderCounts() {
    document.querySelectorAll("[data-count-path]").forEach(function (el) {
      var p = el.getAttribute("data-count-path");
      fetchCount(p).then(function (n) {
        el.textContent = "👁 " + n;
        el.style.visibility = "visible";
      }).catch(function () { el.style.display = "none"; });
    });
  }

  window.LAB = { fetchCount: fetchCount, renderCounts: renderCounts, path: normPath };

  buildNav();
  loadAnalytics();
  if (document.readyState !== "loading") renderCounts();
  else document.addEventListener("DOMContentLoaded", renderCounts);
})();
