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
    { path: "conway.html",  title: "Conway's Law",      emoji: "🔀",
      blurb: "Why software ends up shaped like your org chart — rewire the teams and watch the architecture follow." },
    { path: "kaizen.html",  title: "Kaizen",            emoji: "📈",
      blurb: "The math of tiny gains — improve 1% a day and see why continuous improvement beats big one-off pushes." },
    { path: "uncertainty.html", title: "Uncertainty Principle", emoji: "⚛️",
      blurb: "Heisenberg's rule: pin down a particle's position and its momentum blurs. Squeeze one, watch the other spread." },
    { path: "thermo.html",  title: "Thermodynamics",    emoji: "🌡️",
      blurb: "Why heat flows one way and time has an arrow — release a gas, watch entropy climb, and see why it never un-mixes." },
    { path: "quantum.html", title: "Quantum Mechanics", emoji: "🌀",
      blurb: "The double-slit experiment — fire particles one at a time to build an interference pattern, then watch it collapse when you detect which slit they use." },
    { path: "standardmodel.html", title: "Standard Model", emoji: "🧩",
      blurb: "The 17 elementary particles that build everything — tap any tile to inspect its mass and charge, and light up which ones feel each fundamental force." },
  ],
};
