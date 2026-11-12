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
        entry.target.classList.toggle("visible", entry.isIntersecting);
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

const raiz = document.documentElement;
const ingles = raiz.lang.startsWith("en");
const rotulo = (claro) => (ingles
  ? (claro ? "Switch to dark theme" : "Switch to light theme")
  : (claro ? "Mudar para o tema escuro" : "Mudar para o tema claro"));
const ladoALado = document.querySelector(".lang");
if (ladoALado) {
  const tema = document.createElement("button");
  tema.className = "theme-toggle";
  tema.type = "button";
  tema.innerHTML = '<svg class="sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const atualiza = () => {
    const claro = raiz.dataset.theme === "light";
    tema.setAttribute("aria-label", rotulo(claro));
    tema.title = rotulo(claro);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", claro ? "#f6f8f9" : "#101419");
  };
  tema.addEventListener("click", () => {
    const claro = raiz.dataset.theme !== "light";
    const troca = () => {
      if (claro) raiz.dataset.theme = "light";
      else delete raiz.dataset.theme;
      try { localStorage.setItem("tema", claro ? "claro" : "escuro"); } catch (e) {}
      atualiza();
    };
    if (document.startViewTransition && !reducedMotion) document.startViewTransition(troca);
    else troca();
  });
  ladoALado.after(tema);
  atualiza();
}

const terminal = document.querySelector("[data-terminal]");
if (terminal) {
  const saida = terminal.querySelector(".terminal-out");
  const form = terminal.querySelector(".terminal-in");
  const campo = form.querySelector("input");
  const cv = ingles ? "../assets/cv/resume-gabriel-victor.pdf" : "../assets/cv/curriculo-gabriel-victor.pdf";
  const vai = (id) => () => {
    document.getElementById(id).scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    return ingles ? `Going to #${id}...` : `Indo para #${id}...`;
  };
  const comandos = ingles ? {
    help: () => "about · projects · skills · education · experience · contact · resume · github · theme · lang · clear",
    whoami: () => "Gabriel Victor · Software Engineering student at UDF · Brasília, DF",
    about: vai("sobre"), projects: vai("projetos"), skills: vai("tecnologias"), education: vai("formacao"),
    experience: vai("experiencia"), contact: vai("contato"),
    resume: () => { open(cv); return "Opening résumé (PDF)..."; },
    github: () => { open("https://github.com/gabrielvictoraraujodacruz-create"); return "Opening GitHub..."; },
    theme: () => { document.querySelector(".theme-toggle")?.click(); return "Theme switched."; },
    lang: () => { location.href = "../pt-BR/index.html#sobre"; return "Indo para o português..."; },
  } : {
    help: () => "sobre · projetos · materias · formacao · experiencia · contato · curriculo · github · tema · idioma · limpar",
    whoami: () => "Gabriel Victor · Engenharia de Software na UDF · Brasília, DF",
    sobre: vai("sobre"), projetos: vai("projetos"), materias: vai("tecnologias"), formacao: vai("formacao"),
    experiencia: vai("experiencia"), contato: vai("contato"),
    curriculo: () => { open(cv); return "Abrindo o currículo (PDF)..."; },
    github: () => { open("https://github.com/gabrielvictoraraujodacruz-create"); return "Abrindo o GitHub..."; },
    tema: () => { document.querySelector(".theme-toggle")?.click(); return "Tema trocado."; },
    idioma: () => { location.href = "../en/index.html#sobre"; return "Switching to English..."; },
  };
  const escreve = (texto, classe) => {
    const linha = document.createElement("p");
    if (classe) linha.className = classe;
    linha.textContent = texto;
    saida.append(linha);
    saida.scrollTop = saida.scrollHeight;
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const cmd = campo.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    campo.value = "";
    if (!cmd) return;
    escreve(`$ ${cmd}`, "terminal-cmd");
    if (cmd === "clear" || cmd === "limpar") { saida.replaceChildren(); return; }
    const acao = comandos[cmd];
    escreve(acao ? acao() : (ingles ? `Command not found: ${cmd}. Type help.` : `Comando não encontrado: ${cmd}. Digite help.`));
  });
}

const quando = (data) => {
  const dias = Math.round((Date.now() - new Date(data)) / 86400000);
  const rtf = new Intl.RelativeTimeFormat(ingles ? "en" : "pt-BR", { numeric: "auto" });
  return dias < 30 ? rtf.format(-dias, "day") : rtf.format(-Math.round(dias / 30), "month");
};

const preenche = (lista, itens) => {
  if (!lista || !itens.length) return;
  lista.replaceChildren(...itens.map(([href, titulo, detalhe]) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = titulo;
    const span = document.createElement("span");
    span.textContent = detalhe;
    li.append(a, span);
    return li;
  }));
};

fetch("https://api.github.com/users/gabrielvictoraraujodacruz-create/repos?sort=pushed&per_page=10")
  .then((r) => (r.ok ? r.json() : []))
  .then((repos) => preenche(document.querySelector("[data-github]"), repos
    .filter((r) => !r.fork && r.name !== "gabrielvictoraraujodacruz-create")
    .slice(0, 5)
    .map((r) => [r.html_url, r.name.replace(/[_-]+/g, " ").trim(), `${r.language || "Markdown"} · ${quando(r.pushed_at)}`])))
  .catch(() => {});

fetch("https://dev.to/api/articles?username=gabrielvictorcruz&per_page=5")
  .then((r) => (r.ok ? r.json() : []))
  .then((posts) => preenche(document.querySelector("[data-devto]"), posts
    .map((p) => [p.url, p.title, `${quando(p.published_at)} · ${p.reading_time_minutes} min`])))
  .catch(() => {});
