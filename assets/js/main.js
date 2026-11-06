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

if (!reducedMotion && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".section .card").forEach((card) => {
    const inclina = card.classList.contains("project");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      if (inclina) {
        card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
        card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
      }
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    });
  });
}

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
    const irmaos = element.parentElement.querySelectorAll(":scope > .card");
    const posicao = [...irmaos].indexOf(element);
    if (posicao > 0) element.style.setProperty("--delay", `${(posicao % 4) * 0.08}s`);
    revealObserver.observe(element);
  });
}

if (!reducedMotion) {
  const barra = document.createElement("div");
  barra.className = "progress";
  barra.setAttribute("aria-hidden", "true");
  document.body.prepend(barra);
}

const frase = document.querySelector(".tagline");
if (frase && !reducedMotion) {
  const texto = frase.textContent;
  frase.setAttribute("aria-label", texto);
  frase.style.minHeight = `${frase.offsetHeight}px`;
  frase.textContent = "";
  frase.classList.add("typing-caret");
  let i = 0;
  const digita = () => {
    frase.textContent = texto.slice(0, ++i);
    if (i < texto.length) setTimeout(digita, 28);
    else setTimeout(() => frase.classList.remove("typing-caret"), 1500);
  };
  setTimeout(digita, 500);
}
