const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#menu");
const navLinks = [...nav.querySelectorAll("a")];

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setMenu(!nav.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenu(false);
    menuButton.focus();
  }
});

let currentSection = "";

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      currentSection = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.hash === `#${currentSection}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const langLink = document.querySelector(".lang a");

langLink.addEventListener("click", () => {
  const section = currentSection || location.hash.slice(1);
  langLink.hash = section;
});

const filterButtons = document.querySelectorAll(".filters button");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    const filter = button.dataset.filter;
    projects.forEach((project) => {
      project.hidden = filter !== "all" && project.dataset.category !== filter;
    });
  });
});

const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector(".copy-status");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyStatus.textContent = copyButton.dataset.done;
  } catch {
    copyStatus.textContent = copyButton.dataset.copy;
  }
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".section .card, .section-head").forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}
