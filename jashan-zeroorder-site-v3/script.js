const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const THEME_KEY = "zeroorder-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "light" ? "#fff7ed" : "#0c0a09");
  }
}

applyTheme(getPreferredTheme());

themeToggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

window.matchMedia("(prefers-color-scheme: change)").addEventListener("change", e => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? "light" : "dark");
  }
});

const revealEls = document.querySelectorAll(
  ".section-head, .about-text, .about-facts, .project-card, .stack-item, .quote-card, .timeline-item, .contact-card, .hero-copy, .vision-block, .vision-chip, .path-label, .footer-brand, .footer-col"
);
revealEls.forEach(el => el.classList.add("reveal"));

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => io.observe(el));

document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const overviewSection = document.querySelector(".overview-section");
const overviewCard = document.getElementById("overviewCard");
const overviewBio = document.getElementById("overviewBio");

let overviewTarget = 0;
let overviewProgress = 0;
let overviewAnimating = false;

function getOverviewProgress() {
  if (!overviewSection) return 0;
  const rect = overviewSection.getBoundingClientRect();
  const sectionH = overviewSection.offsetHeight;
  const viewH = window.innerHeight;
  const total = sectionH - viewH;
  if (total <= 0) return 0;
  return clamp(-rect.top, 0, total) / total;
}

function renderOverview(progress) {
  if (!overviewSection || !overviewCard) return;

  const raw = clamp(progress, 0, 1);
  const popP = easeOutCubic(clamp(raw / 0.65, 0, 1));
  const y = 100 * (1 - popP);

  overviewCard.style.setProperty("--ov-y", `${y}%`);

  const chipP = easeOutCubic(clamp((raw - 0.4) / 0.35, 0, 1));
  overviewCard.style.setProperty("--ov-chip", String(chipP));

  if (overviewBio) {
    const bioP = easeOutCubic(clamp((raw - 0.55) / 0.4, 0, 1));
    const isMobile = window.innerWidth <= 800;

    if (isMobile) {
      overviewBio.style.setProperty("--bio-x", "0%");
      overviewBio.style.setProperty("--bio-y", `${40 * (1 - bioP)}px`);
    } else {
      overviewBio.style.setProperty("--bio-x", `${120 * (1 - bioP)}%`);
      overviewBio.style.setProperty("--bio-y", `${24 * (1 - bioP)}px`);
    }

    overviewBio.style.setProperty("--bio-opacity", String(bioP));
  }
}

function animateOverview() {
  const delta = overviewTarget - overviewProgress;

  // Ease toward the scroll position instead of snapping directly to it.
  // This makes partial/slow scrolling feel continuous rather than popping.
  overviewProgress += delta * 0.14;

  if (Math.abs(delta) < 0.001) {
    overviewProgress = overviewTarget;
  }

  renderOverview(overviewProgress);

  if (overviewProgress !== overviewTarget) {
    requestAnimationFrame(animateOverview);
  } else {
    overviewAnimating = false;
  }
}

function updateOverview() {
  overviewTarget = getOverviewProgress();

  if (!overviewAnimating) {
    overviewAnimating = true;
    requestAnimationFrame(animateOverview);
  }
}

function onScroll() {
  updateOverview();
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
updateOverview();
