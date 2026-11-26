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
const temMouse = matchMedia("(hover: hover)").matches;

if (!reducedMotion && temMouse) {
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
const t = (pt, en) => (ingles ? en : pt);
const cv = t("../assets/cv/curriculo-gabriel-victor.pdf", "../assets/cv/resume-gabriel-victor.pdf");
const paginaLab = t("laboratorio.html", "lab.html");
const outroIdioma = t("../en/index.html", "../pt-BR/index.html");
const github = "https://github.com/gabrielvictoraraujodacruz-create";

const rotulo = (claro) => (claro ? t("Mudar para o tema escuro", "Switch to dark theme") : t("Mudar para o tema claro", "Switch to light theme"));
const ladoALado = document.querySelector(".lang");
let tema;
if (ladoALado) {
  tema = document.createElement("button");
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
    conquista("tema");
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

const aviso = document.createElement("p");
aviso.className = "toast";
aviso.setAttribute("role", "status");
document.body.append(aviso);
const filaAvisos = [];
let mostrandoAviso = false;
const proximoAviso = () => {
  const texto = filaAvisos.shift();
  if (texto === undefined) {
    mostrandoAviso = false;
    return;
  }
  mostrandoAviso = true;
  aviso.textContent = texto;
  aviso.classList.add("show");
  setTimeout(() => {
    aviso.classList.remove("show");
    setTimeout(proximoAviso, 300);
  }, 2800);
};
const avisa = (texto) => {
  filaAvisos.push(texto);
  if (!mostrandoAviso) proximoAviso();
};

const segredos = [
  ["terminal", t("Usou o terminal", "Used the terminal"), t("digite help no terminal do Sobre", "type help in the About terminal")],
  ["paleta", t("Abriu a navegação rápida", "Opened quick navigation"), t("um atalho de teclado com a letra K", "a keyboard shortcut with the letter K")],
  ["tema", t("Trocou o tema", "Switched the theme"), t("o botão do sol ou da lua", "the sun or moon button")],
  ["video", t("Viu um projeto em vídeo", "Watched a project video"), t("passe o mouse sobre um projeto", "hover over a project")],
  ["caso", t("Leu um estudo de caso", "Read a case study"), t("o botão Como fiz", "the How I built it button")],
  ["lab", t("Visitou o laboratório", "Visited the lab"), t("tem uma página extra na seção Projetos", "there is an extra page in Projects")],
  ["matrix", t("Entrou na Matrix", "Entered the Matrix"), t("um comando do terminal com nome de filme", "a terminal command named after a movie")],
  ["retro", t("Ligou o modo retrô", "Turned on retro mode"), "↑ ↑ ↓ ↓ ← → ← → B A"],
];
const achados = (() => {
  try {
    return new Set(JSON.parse(localStorage.getItem("segredos") || "[]"));
  } catch (e) {
    return new Set();
  }
})();
const placar = () => {
  document.querySelectorAll("[data-segredos]").forEach((el) => {
    el.textContent = `${achados.size}/${segredos.length}`;
  });
};
const conquista = (id) => {
  if (achados.has(id)) return;
  achados.add(id);
  try { localStorage.setItem("segredos", JSON.stringify([...achados])); } catch (e) {}
  placar();
  const nome = segredos.find(([chave]) => chave === id)[1];
  const conta = `${achados.size}/${segredos.length}`;
  avisa(achados.size === segredos.length
    ? t("Você achou todos os segredos do site!", "You found every secret on this site!")
    : t(`Segredo achado: ${nome} (${conta})`, `Secret found: ${nome} (${conta})`));
};

const painel = document.createElement("dialog");
painel.className = "caso";
painel.setAttribute("aria-labelledby", "segredos-t");
document.body.append(painel);
const abrePainel = () => {
  painel.innerHTML = `<form method="dialog"><button class="caso-fechar" aria-label="${t("Fechar", "Close")}">×</button></form><span class="label">${t("Segredos", "Secrets")}</span><h2 id="segredos-t">${t("Segredos achados", "Secrets found")}: ${achados.size}/${segredos.length}</h2><ul class="segredos"></ul>`;
  painel.querySelector("ul").append(...segredos.map(([id, nome, dica]) => {
    const li = document.createElement("li");
    const ok = achados.has(id);
    li.className = ok ? "ok" : "";
    li.innerHTML = "<b></b><span></span>";
    li.firstChild.textContent = ok ? nome : "???";
    li.lastChild.textContent = ok ? t("achado", "found") : t(`Dica: ${dica}`, `Hint: ${dica}`);
    return li;
  }));
  painel.showModal();
};
document.querySelectorAll("[data-abre-segredos]").forEach((botao) => botao.addEventListener("click", abrePainel));

document.querySelectorAll("[data-caso]").forEach((botao) => {
  const caixa = document.getElementById(botao.dataset.caso);
  botao.addEventListener("click", () => {
    caixa.showModal();
    conquista("caso");
  });
});
document.querySelectorAll("dialog.caso").forEach((caixa) => {
  caixa.addEventListener("click", (e) => {
    if (e.target === caixa) caixa.close();
  });
});
placar();

const alternaRetro = () => {
  const liga = !raiz.hasAttribute("data-retro");
  raiz.toggleAttribute("data-retro", liga);
  avisa(liga ? t("Modo retrô ligado. Repita o código para sair.", "Retro mode on. Enter the code again to leave.") : t("Modo retrô desligado.", "Retro mode off."));
  if (liga) conquista("retro");
  return liga;
};

const konami = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
let konamiPos = 0;
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, textarea")) return;
  const tecla = e.key.toLowerCase();
  konamiPos = tecla === konami[konamiPos] ? konamiPos + 1 : (tecla === konami[0] ? 1 : 0);
  if (konamiPos === konami.length) {
    konamiPos = 0;
    alternaRetro();
  }
});

const vaiPara = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
};

const chuvaMatrix = () => {
  conquista("matrix");
  const tela = document.createElement("canvas");
  tela.className = "matrix";
  tela.setAttribute("aria-hidden", "true");
  document.body.append(tela);
  const ctx = tela.getContext("2d");
  tela.width = innerWidth;
  tela.height = innerHeight;
  const tam = 16;
  const colunas = Array.from({ length: Math.ceil(tela.width / tam) }, () => Math.random() * -40);
  const letras = "01アイウエオカキクケコサシスセソタチツテトナニヌネノGABRIEL{}<>/";
  let fim = false;
  const para = () => { fim = true; };
  const passo = () => {
    if (fim) {
      tela.remove();
      removeEventListener("keydown", para);
      return;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, tela.width, tela.height);
    ctx.fillStyle = "#33ff66";
    ctx.font = `${tam}px monospace`;
    colunas.forEach((y, i) => {
      ctx.fillText(letras[Math.floor(Math.random() * letras.length)], i * tam, y * tam);
      colunas[i] = y * tam > tela.height && Math.random() > 0.97 ? 0 : y + 1;
    });
    requestAnimationFrame(passo);
  };
  tela.addEventListener("click", para);
  addEventListener("keydown", para);
  setTimeout(para, 6000);
  passo();
};

const terminal = document.querySelector("[data-terminal]");
if (terminal) {
  const saida = terminal.querySelector(".terminal-out");
  const form = terminal.querySelector(".terminal-in");
  const campo = form.querySelector("input");
  const vai = (id) => () => {
    vaiPara(id);
    return t(`Indo para #${id}...`, `Going to #${id}...`);
  };
  const arquivos = ingles ? {
    "about.txt": "Software Engineering student at UDF (Brasília). I started working at 15 selling açaí on the street, and today I work with technology and operations at a law office.",
    "experience.txt": "Law office (since Jan 2026) · Casa Baco restaurant, cashier to assistant manager (age 24–27) · Açaí Artesanal (18–23) · Brasília Consig (16–18) · street açaí stand (15–16)",
    "contact.txt": "gabrielvictoraraujodacruz@gmail.com · WhatsApp +55 61 99371-6090",
    "secret.txt": "There is a code hidden in this site. Hint: ↑ ↑ ↓ ↓ ← → ← → B A (outside the terminal).",
  } : {
    "sobre.txt": "Estudante de Engenharia de Software na UDF (Brasília). Comecei a trabalhar aos 15 anos vendendo açaí na rua e hoje trabalho com tecnologia e operações num escritório de advocacia.",
    "experiencia.txt": "Escritório de advocacia (desde jan/2026) · Casa Baco, de caixa a subgerente (24 aos 27) · Açaí Artesanal (18 aos 23) · Brasília Consig (16 aos 18) · barraca de açaí na rua (15 aos 16)",
    "contato.txt": "gabrielvictoraraujodacruz@gmail.com · WhatsApp (61) 99371-6090",
    "segredo.txt": "Tem um código escondido neste site. Dica: ↑ ↑ ↓ ↓ ← → ← → B A (fora do terminal).",
  };
  const cafe = "   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----'";
  const comandos = ingles ? {
    help: () => "about · projects · skills · education · experience · contact · resume · github · lab · theme · lang · ls · cat · whoami · date · echo · coffee · matrix · retro · secrets · sudo · clear",
    secrets: () => { abrePainel(); return `Secrets found: ${achados.size}/${segredos.length}`; },
    whoami: () => "Gabriel Victor · Software Engineering student at UDF · Brasília, Brazil",
    about: vai("sobre"), projects: vai("projetos"), skills: vai("tecnologias"), education: vai("formacao"),
    experience: vai("experiencia"), contact: vai("contato"),
    resume: () => { open(cv); return "Opening résumé (PDF)..."; },
    github: () => { open(github); return "Opening GitHub..."; },
    lab: () => { location.href = paginaLab; return "Opening the lab..."; },
    theme: () => { tema?.click(); return "Theme switched."; },
    lang: () => { location.href = `${outroIdioma}#sobre`; return "Indo para o português..."; },
    ls: () => `${Object.keys(arquivos).join("  ")}  resume.pdf`,
    cat: (nome) => arquivos[nome] ?? (nome ? `cat: ${nome}: no such file` : "usage: cat <file>  (try ls)"),
    date: () => new Date().toLocaleString("en"),
    echo: (...p) => p.join(" "),
    coffee: () => ["pre", `${cafe}\nOne coffee for you. Now back to coding.`],
    matrix: () => { if (reducedMotion) return "Animations are off on this device."; chuvaMatrix(); return "Wake up, Neo... (click or press a key to leave)"; },
    retro: () => (alternaRetro() ? "Retro mode on." : "Retro mode off."),
    sudo: () => "gabriel is not in the sudoers file. This incident will be reported. (just kidding)",
  } : {
    help: () => "sobre · projetos · materias · formacao · experiencia · contato · curriculo · github · lab · tema · idioma · ls · cat · whoami · data · echo · cafe · matrix · retro · segredos · sudo · limpar",
    segredos: () => { abrePainel(); return `Segredos achados: ${achados.size}/${segredos.length}`; },
    whoami: () => "Gabriel Victor · Engenharia de Software na UDF · Brasília, DF",
    sobre: vai("sobre"), projetos: vai("projetos"), materias: vai("tecnologias"), formacao: vai("formacao"),
    experiencia: vai("experiencia"), contato: vai("contato"),
    curriculo: () => { open(cv); return "Abrindo o currículo (PDF)..."; },
    github: () => { open(github); return "Abrindo o GitHub..."; },
    lab: () => { location.href = paginaLab; return "Abrindo o laboratório..."; },
    tema: () => { tema?.click(); return "Tema trocado."; },
    idioma: () => { location.href = `${outroIdioma}#sobre`; return "Switching to English..."; },
    ls: () => `${Object.keys(arquivos).join("  ")}  curriculo.pdf`,
    cat: (nome) => arquivos[nome] ?? (nome ? `cat: ${nome}: arquivo não encontrado` : "uso: cat <arquivo>  (tente ls)"),
    data: () => new Date().toLocaleString("pt-BR"),
    echo: (...p) => p.join(" "),
    cafe: () => ["pre", `${cafe}\nUm café para você. Agora volta pro código.`],
    matrix: () => { if (reducedMotion) return "Animações desligadas neste aparelho."; chuvaMatrix(); return "Acorde, Neo... (clique ou aperte uma tecla para sair)"; },
    retro: () => (alternaRetro() ? "Modo retrô ligado." : "Modo retrô desligado."),
    sudo: () => "gabriel não está no arquivo sudoers. Este incidente será reportado. (brincadeira)",
  };
  const historico = [];
  let posHist = 0;
  const escreve = (texto, classe) => {
    const linha = document.createElement("p");
    if (classe) linha.className = classe;
    linha.textContent = texto;
    saida.append(linha);
    saida.scrollTop = saida.scrollHeight;
  };
  const limpa = (texto) => texto.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bruto = campo.value.trim();
    campo.value = "";
    if (!bruto) return;
    historico.push(bruto);
    posHist = historico.length;
    escreve(`$ ${bruto}`, "terminal-cmd");
    const [nome, ...args] = bruto.split(/\s+/);
    const cmd = limpa(nome);
    if (cmd === "clear" || cmd === "limpar") { saida.replaceChildren(); return; }
    const acao = comandos[cmd];
    if (!acao) {
      escreve(t(`Comando não encontrado: ${cmd}. Digite help.`, `Command not found: ${cmd}. Type help.`));
      return;
    }
    conquista("terminal");
    const resposta = acao(...args.map((a) => (cmd === "echo" ? a : limpa(a))));
    if (Array.isArray(resposta)) escreve(resposta[1], "terminal-pre");
    else escreve(resposta);
  });
  campo.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!historico.length) return;
      e.preventDefault();
      posHist = Math.max(0, Math.min(historico.length, posHist + (e.key === "ArrowUp" ? -1 : 1)));
      campo.value = historico[posHist] ?? "";
    } else if (e.key === "Tab" && campo.value.trim()) {
      const partes = campo.value.split(/\s+/);
      const ultima = limpa(partes.at(-1));
      const opcoes = partes.length > 1 ? Object.keys(arquivos) : Object.keys(comandos);
      const achados = opcoes.filter((o) => o.startsWith(ultima));
      if (!achados.length) return;
      e.preventDefault();
      if (achados.length === 1) {
        partes[partes.length - 1] = achados[0];
        campo.value = `${partes.join(" ")}${partes.length === 1 ? " " : ""}`;
      } else escreve(achados.join("  "));
    }
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

const anima = (el) => {
  const alvo = Number(el.dataset.alvo || el.textContent);
  if (reducedMotion) {
    el.textContent = alvo;
    return;
  }
  const inicio = performance.now();
  const passo = (agora) => {
    const p = Math.min(1, (agora - inicio) / 1400);
    el.textContent = Math.round(alvo * (1 - (1 - p) ** 3));
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
};

const numero = (nome, valor) => {
  const el = document.querySelector(`[data-stat="${nome}"]`);
  if (!el || !valor) return;
  el.dataset.alvo = valor;
  if (el.dataset.visto) anima(el);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll("[data-stat]").forEach((el) => {
      el.dataset.visto = "1";
      anima(el);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });
document.querySelectorAll(".stats").forEach((el) => statsObserver.observe(el));

fetch(`https://api.github.com/users/gabrielvictoraraujodacruz-create/repos?sort=pushed&per_page=100`)
  .then((r) => (r.ok ? r.json() : []))
  .then((todos) => {
    const repos = todos.filter((r) => !r.fork);
    if (!repos.length) return;
    numero("repos", repos.length);
    numero("langs", new Set(repos.map((r) => r.language).filter(Boolean)).size);
    graficoLangs(repos.reduce((soma, r) => {
      const nome = r.language || "Markdown";
      soma[nome] = (soma[nome] || 0) + 1;
      return soma;
    }, {}));
    const publicos = repos.filter((r) => r.name !== "gabrielvictoraraujodacruz-create" && !/parque/i.test(r.name));
    preenche(document.querySelector("[data-github]"), publicos
      .slice(0, 5)
      .map((r) => [r.html_url, r.name.replace(/[_-]+/g, " ").trim(), `${r.language || "Markdown"} · ${quando(r.pushed_at)}`]));
    if (publicos[0]) ultimoCommit(publicos[0]);
  })
  .catch(() => {});

fetch("https://api.github.com/repos/gabrielvictoraraujodacruz-create/java_diario/contents/estudo")
  .then((r) => (r.ok ? r.json() : []))
  .then((itens) => numero("java", Math.max(0, ...itens.map((i) => Number(/^dia-(\d+)$/.exec(i.name)?.[1] || 0)))))
  .catch(() => {});

fetch("https://dev.to/api/articles?username=gabrielvictorcruz&per_page=5")
  .then((r) => (r.ok ? r.json() : []))
  .then((posts) => preenche(document.querySelector("[data-devto]"), posts
    .map((p) => [p.url, p.title, `${quando(p.published_at)} · ${p.reading_time_minutes} min`])))
  .catch(() => {});

document.querySelectorAll(".project video").forEach((video) => {
  if (reducedMotion) return;
  const card = video.closest(".project");
  const toca = () => video.play().then(() => conquista("video")).catch(() => {});
  const para = () => {
    video.pause();
    video.currentTime = 0;
  };
  if (temMouse) {
    card.addEventListener("pointerenter", toca);
    card.addEventListener("pointerleave", para);
    card.addEventListener("focusin", toca);
    card.addEventListener("focusout", para);
  } else {
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? toca() : video.pause()), { threshold: 0.7 }).observe(video);
  }
});

const hero = document.querySelector(".hero");
if (hero && !reducedMotion) {
  const tela = document.createElement("canvas");
  tela.className = "rede";
  tela.setAttribute("aria-hidden", "true");
  hero.append(tela);
  const ctx = tela.getContext("2d");
  const alcance = 130;
  let pontos = [];
  let largura = 0;
  let altura = 0;
  let mouse = null;
  let visivel = true;
  let rodando = false;
  const monta = () => {
    const escala = devicePixelRatio || 1;
    largura = tela.clientWidth;
    altura = tela.clientHeight;
    tela.width = largura * escala;
    tela.height = altura * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    const total = Math.min(90, Math.round((largura * altura) / 11000));
    pontos = Array.from({ length: total }, () => ({
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  };
  const desenha = () => {
    if (!visivel) {
      rodando = false;
      return;
    }
    const cor = getComputedStyle(raiz).getPropertyValue("--glow").trim();
    ctx.clearRect(0, 0, largura, altura);
    pontos.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;
    });
    const todos = mouse ? [...pontos, mouse] : pontos;
    ctx.lineWidth = 1;
    for (let i = 0; i < todos.length; i++) {
      for (let j = i + 1; j < todos.length; j++) {
        const d = Math.hypot(todos[i].x - todos[j].x, todos[i].y - todos[j].y);
        if (d > alcance) continue;
        const forte = todos[j] === mouse ? 0.8 : 0.42;
        ctx.strokeStyle = `rgba(${cor}, ${(1 - d / alcance) * forte})`;
        ctx.beginPath();
        ctx.moveTo(todos[i].x, todos[i].y);
        ctx.lineTo(todos[j].x, todos[j].y);
        ctx.stroke();
      }
    }
    ctx.fillStyle = `rgba(${cor}, 0.85)`;
    pontos.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(desenha);
  };
  const liga = () => {
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(desenha);
  };
  hero.addEventListener("pointermove", (e) => {
    const r = tela.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  hero.addEventListener("pointerleave", () => { mouse = null; });
  new ResizeObserver(monta).observe(tela);
  new IntersectionObserver(([entry]) => {
    visivel = entry.isIntersecting;
    if (visivel) liga();
  }).observe(hero);
  monta();
}

const header = document.querySelector(".header-inner");
if (header) {
  const atalhos = [
    ...navLinks.map((a) => ({ nome: a.textContent, dica: `#${a.hash.slice(1)}`, faz: () => vaiPara(a.hash.slice(1)) })),
    { nome: t("Depoimentos", "Testimonials"), dica: "#depoimentos", faz: () => vaiPara("depoimentos") },
    { nome: t("Laboratório da matéria", "Course lab"), dica: paginaLab, faz: () => { location.href = paginaLab; } },
    { nome: t("Baixar currículo", "Download résumé"), dica: "PDF", faz: () => open(cv) },
    { nome: "GitHub", dica: "github.com", faz: () => open(github) },
    { nome: t("Trocar tema claro/escuro", "Toggle light/dark theme"), dica: t("tema", "theme"), faz: () => tema?.click() },
    { nome: t("Read in English", "Ler em português"), dica: t("idioma", "language"), faz: () => { location.href = outroIdioma; } },
    { nome: t("Abrir o terminal", "Open the terminal"), dica: "$ help", faz: () => { vaiPara("sobre"); setTimeout(() => terminal?.querySelector("input").focus({ preventScroll: true }), 500); } },
    { nome: t("Modo retrô", "Retro mode"), dica: "↑↑↓↓←→←→BA", faz: alternaRetro },
    { nome: t("Segredos achados", "Secrets found"), dica: t("segredos", "secrets"), faz: abrePainel },
    { nome: t("Estudo de caso: este portfólio", "Case study: this portfolio"), dica: t("como fiz", "how I built it"), faz: () => document.querySelector('[data-caso="caso-portfolio"]')?.click() },
  ];
  const caixa = document.createElement("dialog");
  caixa.className = "paleta";
  caixa.setAttribute("aria-label", t("Navegação rápida", "Quick navigation"));
  caixa.innerHTML = `<input type="text" role="combobox" aria-expanded="true" aria-controls="paleta-lista" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="${t("Para onde você quer ir?", "Where do you want to go?")}"><ul id="paleta-lista" role="listbox"></ul><p class="paleta-dica"><kbd>↑</kbd><kbd>↓</kbd> ${t("navegar", "move")} · <kbd>Enter</kbd> ${t("abrir", "open")} · <kbd>Esc</kbd> ${t("fechar", "close")}</p>`;
  document.body.append(caixa);
  const busca = caixa.querySelector("input");
  const lista = caixa.querySelector("ul");
  let visiveis = [];
  let ativo = 0;
  const normal = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const marca = () => {
    [...lista.children].forEach((li, i) => li.setAttribute("aria-selected", String(i === ativo)));
    busca.setAttribute("aria-activedescendant", `paleta-${ativo}`);
    lista.children[ativo]?.scrollIntoView({ block: "nearest" });
  };
  const executa = (item) => {
    caixa.close();
    item?.faz();
  };
  const filtra = () => {
    const q = normal(busca.value);
    visiveis = atalhos.filter((a) => normal(`${a.nome} ${a.dica}`).includes(q));
    ativo = 0;
    lista.replaceChildren(...visiveis.map((a, i) => {
      const li = document.createElement("li");
      li.id = `paleta-${i}`;
      li.setAttribute("role", "option");
      li.innerHTML = "<span></span><small></small>";
      li.firstChild.textContent = a.nome;
      li.lastChild.textContent = a.dica;
      li.addEventListener("click", () => executa(a));
      li.addEventListener("pointermove", () => { ativo = i; marca(); });
      return li;
    }));
    if (!visiveis.length) {
      const li = document.createElement("li");
      li.className = "vazio";
      li.textContent = t("Nada encontrado.", "Nothing found.");
      lista.append(li);
    }
    marca();
  };
  const abre = () => {
    if (caixa.open) return;
    busca.value = "";
    filtra();
    caixa.showModal();
    busca.focus();
    conquista("paleta");
  };
  busca.addEventListener("input", filtra);
  busca.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!visiveis.length) return;
      ativo = (ativo + (e.key === "ArrowDown" ? 1 : -1) + visiveis.length) % visiveis.length;
      marca();
    } else if (e.key === "Enter") {
      e.preventDefault();
      executa(visiveis[ativo]);
    }
  });
  caixa.addEventListener("click", (e) => {
    if (e.target === caixa) caixa.close();
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      abre();
    }
  });
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "kbar-btn";
  botao.setAttribute("aria-label", t("Navegação rápida (Ctrl K)", "Quick navigation (Ctrl K)"));
  botao.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><kbd>Ctrl K</kbd>';
  botao.addEventListener("click", abre);
  (tema || ladoALado).after(botao);
}

function ultimoCommit(repo) {
  const alvo = document.querySelector("[data-commit]");
  if (!alvo) return;
  fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=1`)
    .then((r) => (r.ok ? r.json() : []))
    .then(([commit]) => {
      if (!commit) return;
      const link = document.createElement("a");
      link.href = commit.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = `“${commit.commit.message.split("\n")[0]}”`;
      const nome = repo.name.replace(/[_-]+/g, " ").trim();
      alvo.replaceChildren(
        t("Último commit: ", "Latest commit: "),
        link,
        t(` em ${nome}, ${quando(commit.commit.author.date)}.`, ` in ${nome}, ${quando(commit.commit.author.date)}.`)
      );
      alvo.hidden = false;
    })
    .catch(() => {});
}

let contagemLangs = { Markdown: 8, HTML: 4, Python: 2, C: 1, CSS: 1, JavaScript: 1, "Jupyter Notebook": 1 };
let langsVisto = false;

function graficoLangs(contagem, animar = true) {
  const caixa = document.querySelector("[data-langs]");
  if (!caixa) return;
  contagemLangs = contagem;
  const tela = caixa.querySelector("canvas");
  const lista = caixa.querySelector("ul");
  const itens = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
  const total = itens.reduce((soma, [, n]) => soma + n, 0);
  const claro = raiz.dataset.theme === "light" && !raiz.hasAttribute("data-retro");
  const cores = claro
    ? ["#0b6b5c", "#1f4e9c", "#a86b00", "#c2410c", "#be185d", "#6d28d9", "#0369a1", "#0a7a4f"]
    : ["#83f3de", "#adc6ff", "#ffe08a", "#ff9b73", "#f6a6c1", "#c9a3ff", "#8fd3ff", "#6bf8ba"];
  const nomes = { Markdown: t("Só texto (Markdown)", "Text only (Markdown)") };
  lista.replaceChildren(...itens.map(([nome, n], i) => {
    const li = document.createElement("li");
    li.innerHTML = '<i aria-hidden="true"></i><span></span><small></small>';
    li.firstChild.style.background = cores[i % cores.length];
    li.children[1].textContent = nomes[nome] || nome;
    li.lastChild.textContent = `${n} · ${Math.round((n / total) * 100)}%`;
    return li;
  }));
  const estilo = getComputedStyle(raiz);
  const escala = devicePixelRatio || 1;
  const tam = 200;
  tela.width = tam * escala;
  tela.height = tam * escala;
  const ctx = tela.getContext("2d");
  ctx.setTransform(escala, 0, 0, escala, 0, 0);
  const desenha = (p) => {
    ctx.clearRect(0, 0, tam, tam);
    ctx.lineWidth = 24;
    ctx.strokeStyle = estilo.getPropertyValue("--surface-3");
    ctx.beginPath();
    ctx.arc(tam / 2, tam / 2, 76, 0, Math.PI * 2);
    ctx.stroke();
    let inicio = -Math.PI / 2;
    itens.forEach(([, n], i) => {
      const angulo = (n / total) * Math.PI * 2 * p;
      ctx.strokeStyle = cores[i % cores.length];
      ctx.beginPath();
      ctx.arc(tam / 2, tam / 2, 76, inicio, inicio + Math.max(0, angulo - 0.03));
      ctx.stroke();
      inicio += angulo;
    });
    ctx.fillStyle = estilo.getPropertyValue("--text");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 40px ${estilo.getPropertyValue("--title")}`;
    ctx.fillText(String(total), tam / 2, tam / 2 - 8);
    ctx.fillStyle = estilo.getPropertyValue("--muted");
    ctx.font = `12px ${estilo.getPropertyValue("--mono")}`;
    ctx.fillText(t("repositórios", "repositories"), tam / 2, tam / 2 + 22);
  };
  if (!animar || reducedMotion || !langsVisto) {
    desenha(langsVisto || reducedMotion || !animar ? 1 : 0);
    return;
  }
  const comeco = performance.now();
  const passo = (agora) => {
    const p = Math.min(1, (agora - comeco) / 1100);
    desenha(1 - (1 - p) ** 3);
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

const caixaLangs = document.querySelector("[data-langs]");
if (caixaLangs) {
  graficoLangs(contagemLangs);
  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    langsVisto = true;
    graficoLangs(contagemLangs);
    obs.disconnect();
  }, { threshold: 0.4 }).observe(caixaLangs);
  new MutationObserver(() => graficoLangs(contagemLangs, false)).observe(raiz, { attributes: true, attributeFilter: ["data-theme", "data-retro"] });
}
