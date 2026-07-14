// Single source of truth for the site. Add a future topic = one entry here + one HTML file.
window.SITE = {
  name: "Visual Learn Lab",
  tagline: "Learn hard ideas by playing with them.",

  // GoatCounter site code -> https://<code>.goatcounter.com
  // Leave "" to disable analytics until you've created the account.
  goatcounterCode: "learn-lab",

  // Ordered list drives both the nav bar and the homepage grid.
  topics: [
    { path: "catan.html",   title: "Catan Strategy",   emoji: "⬢",
      blurb: "Play Settlers of Catan against AI with a live win-strategy coach and run bulk simulations." },
    { path: "goal.html",    title: "The Goal",          emoji: "🏭",
      blurb: "Goldratt's Theory of Constraints — tune a production line and watch the bottleneck rule throughput." },
    { path: "feynman.html", title: "Feynman Technique", emoji: "🧠",
      blurb: "Learn anything by explaining it simply. A guided 4-step workflow with a live clarity meter." },
    { path: "newton.html",  title: "Newton's Gravity",  emoji: "🌍",
      blurb: "Feel the inverse-square law and fling planets into orbit with a real gravity simulator." },
  ],
};
