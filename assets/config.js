// Single source of truth for the site. Add a future topic = one entry here + one HTML file.
window.SITE = {
  name: "Visual Learn Lab",
  tagline: "Learn hard ideas by playing with them.",

  // GoatCounter site code -> https://<code>.goatcounter.com
  // Leave "" to disable analytics until you've created the account.
  goatcounterCode: "learn-lab",

  // "Expert feedback" delivery via Web3Forms (https://web3forms.com). This access key is
  // write-only and safe in public source; submissions are emailed to the key's owner.
  web3formsKey: "0d9ecc1c-731e-4ec0-89ed-ca31a0fa796c",

  // Ordered list drives the homepage grid. `group` drives the nav dropdown menus
  // (groups appear in the order they first show up below).
  topics: [
    { path: "catan.html",   title: "Catan Strategy",   emoji: "⬢", group: "Games",
      blurb: "Play Settlers of Catan against AI with a live win-strategy coach and run bulk simulations." },
    { path: "goal.html",    title: "The Goal",          emoji: "🏭", group: "Productivity",
      blurb: "Goldratt's Theory of Constraints — tune a production line and watch the bottleneck rule throughput." },
    { path: "feynman.html", title: "Feynman Technique", emoji: "🧠", group: "Productivity",
      blurb: "Learn anything by explaining it simply. A guided 4-step workflow with a live clarity meter." },
    { path: "newton.html",  title: "Newton's Gravity",  emoji: "🌍", group: "Classical Physics",
      blurb: "Feel the inverse-square law and fling planets into orbit with a real gravity simulator." },
    { path: "conway.html",  title: "Conway's Law",      emoji: "🔀", group: "Productivity",
      blurb: "Why software ends up shaped like your org chart — rewire the teams and watch the architecture follow." },
    { path: "kaizen.html",  title: "Kaizen",            emoji: "📈", group: "Productivity",
      blurb: "The math of tiny gains — improve 1% a day and see why continuous improvement beats big one-off pushes." },
    { path: "uncertainty.html", title: "Uncertainty Principle", emoji: "⚛️", group: "Quantum",
      blurb: "Heisenberg's rule: pin down a particle's position and its momentum blurs. Squeeze one, watch the other spread." },
    { path: "thermo.html",  title: "Thermodynamics",    emoji: "🌡️", group: "Classical Physics",
      blurb: "Why heat flows one way and time has an arrow — release a gas, watch entropy climb, and see why it never un-mixes." },
    { path: "quantum.html", title: "Quantum Mechanics", emoji: "🌀", group: "Quantum",
      blurb: "The double-slit experiment — fire particles one at a time to build an interference pattern, then watch it collapse when you detect which slit they use." },
    { path: "standardmodel.html", title: "Standard Model", emoji: "🧩", group: "Quantum",
      blurb: "The 17 elementary particles that build everything — tap any tile to inspect its mass and charge, and light up which ones feel each fundamental force." },
    { path: "relativity.html", title: "General Relativity", emoji: "🌌", group: "Relativity & Cosmos",
      blurb: "Gravity is curved spacetime — warp the grid with a mass, launch a probe, and watch its orbit precess the way Einstein predicts but Newton can't." },
    { path: "special.html", title: "Special Relativity", emoji: "🚀", group: "Relativity & Cosmos",
      blurb: "Why moving clocks run slow — slide a light clock toward light speed and watch time dilate and lengths contract, all because light's speed never changes." },
    { path: "electromagnetism.html", title: "Electromagnetism", emoji: "🧲", group: "Classical Physics",
      blurb: "Electricity, magnetism and light are one thing — watch perpendicular E and B fields propagate and sweep the frequency across the whole spectrum." },
    { path: "bigbang.html", title: "The Big Bang", emoji: "💥", group: "Relativity & Cosmos",
      blurb: "The expanding universe — watch galaxies fly apart by Hubble's law, redshift with distance, and see why the expansion has no center." },
    { path: "qft.html", title: "Quantum Field Theory", emoji: "🌊", group: "Quantum",
      blurb: "Particles are ripples in fields — poke excitations into a quantum field, annihilate matter with antimatter, and watch the vacuum bubble with virtual pairs." },
    { path: "statmech.html", title: "Statistical Mechanics", emoji: "🎲", group: "Classical Physics",
      blurb: "Order from molecular chaos — start every particle at one speed and watch collisions thermalize the gas into the Maxwell–Boltzmann distribution." },
  ],
};
