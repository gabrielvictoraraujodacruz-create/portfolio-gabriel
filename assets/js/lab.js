const quadro = document.getElementById("quadro");
const ctx = quadro.getContext("2d");
let cor = "#83f3de";
let anterior = null;

const ponto = (e) => {
  const r = quadro.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * quadro.width,
    y: ((e.clientY - r.top) / r.height) * quadro.height,
  };
};

quadro.addEventListener("pointerdown", (e) => {
  quadro.setPointerCapture(e.pointerId);
  anterior = ponto(e);
});

quadro.addEventListener("pointermove", (e) => {
  if (!anterior) return;
  const atual = ponto(e);
  ctx.strokeStyle = cor;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(anterior.x, anterior.y);
  ctx.lineTo(atual.x, atual.y);
  ctx.stroke();
  anterior = atual;
});

["pointerup", "pointercancel"].forEach((tipo) => quadro.addEventListener(tipo, () => { anterior = null; }));

document.getElementById("limpa-quadro").addEventListener("click", () => ctx.clearRect(0, 0, quadro.width, quadro.height));

const cores = document.querySelectorAll(".cor");
cores.forEach((botao) => {
  botao.addEventListener("click", () => {
    cor = botao.dataset.cor;
    cores.forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));
  });
});

const largura = document.getElementById("largura");
const breakpoint = document.getElementById("breakpoint");
const pontos = [["xxl", 1400], ["xl", 1200], ["lg", 992], ["md", 768], ["sm", 576], ["xs", 0]];
const mede = () => {
  largura.textContent = `${innerWidth}px`;
  breakpoint.textContent = pontos.find(([, min]) => innerWidth >= min)[0];
};
addEventListener("resize", mede);
mede();

const contador = document.getElementById("contador");
let valor = 0;
try { valor = Number(localStorage.getItem("lab-contador")) || 0; } catch (e) {}
contador.textContent = valor;
document.querySelectorAll("[data-passo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const passo = Number(botao.dataset.passo);
    valor = passo === 0 ? 0 : valor + passo;
    contador.textContent = valor;
    try { localStorage.setItem("lab-contador", valor); } catch (e) {}
  });
});

document.getElementById("dispara-toast").addEventListener("click", () => {
  if (window.bootstrap) bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso")).show();
});

try {
  const achados = new Set(JSON.parse(localStorage.getItem("segredos") || "[]"));
  achados.add("lab");
  localStorage.setItem("segredos", JSON.stringify([...achados]));
} catch (e) {}

const ficha = document.getElementById("ficha");
if (ficha) {
  const modelo = document.getElementById("modelo-contrato");
  const saida = document.getElementById("contrato-saida");
  const faltando = document.getElementById("faltando");
  const tempo = document.getElementById("tempo-motor");
  const imprime = document.getElementById("imprime");
  const etapas = [...document.querySelectorAll(".etapas-motor li")];
  const ingles = document.documentElement.lang === "en";
  const feminino = JSON.parse(modelo.dataset.f);
  const masculino = JSON.parse(modelo.dataset.m);
  const campos = [...ficha.querySelectorAll("[data-campo]")];
  document.getElementById("modelo-texto").textContent = modelo.innerHTML.replace(/<[^>]+>/g, "").trim();

  const escapa = (texto) => texto.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const marca = (i, estado) => { if (etapas[i]) etapas[i].className = estado; };

  const exemplos = ingles
    ? { NOME: "Maria Example Santos", NACIONALIDADE: "Brazilian", ESTADO_CIVIL: "widowed", PROFISSAO: "seamstress", CPF: "123.456.789-09", ENDERECO: "Block 10, Set B, House 5, Ceilândia, Brasília", CEP: "72200-000", BENEFICIO: "survivor's pension" }
    : { NOME: "Maria Exemplo dos Santos", NACIONALIDADE: "brasileira", ESTADO_CIVIL: "viúva", PROFISSAO: "costureira", CPF: "123.456.789-09", ENDERECO: "Quadra 10, Conjunto B, Casa 5, Ceilândia, Brasília/DF", CEP: "72200-000", BENEFICIO: "pensão por morte" };

  const mascaras = {
    "f-cpf": [11, (d) => d.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2")],
    "f-cep": [8, (d) => d.replace(/^(\d{5})(\d)/, "$1-$2")],
  };
  Object.entries(mascaras).forEach(([id, [limite, formata]]) => {
    document.getElementById(id).addEventListener("input", (e) => {
      e.target.value = formata(e.target.value.replace(/\D/g, "").slice(0, limite));
    });
  });

  document.getElementById("exemplo").addEventListener("click", () => {
    campos.forEach((campo) => { campo.value = exemplos[campo.dataset.campo]; });
  });

  ficha.addEventListener("reset", () => {
    etapas.forEach((_, i) => marca(i, ""));
    [saida, faltando, tempo, imprime].forEach((el) => { el.hidden = true; });
  });

  ficha.addEventListener("submit", async (e) => {
    e.preventDefault();
    etapas.forEach((_, i) => marca(i, ""));
    [saida, faltando, tempo, imprime].forEach((el) => { el.hidden = true; });
    const inicio = performance.now();

    marca(0, "feito");
    const dados = Object.fromEntries(campos.map((campo) => [campo.dataset.campo, campo.value.trim()]));
    await espera(250);

    const problemas = campos.filter((campo) => {
      const valor = campo.value.trim();
      return !valor || (campo.dataset.formato && !new RegExp(campo.dataset.formato).test(valor));
    });
    if (problemas.length) {
      marca(1, "erro");
      faltando.textContent = `${modelo.dataset.falta} ${problemas.map((campo) => {
        const rotulo = ficha.querySelector(`label[for="${campo.id}"]`).textContent;
        return campo.value.trim() ? `${rotulo} (${modelo.dataset.formatoMsg})` : rotulo;
      }).join(", ")}`;
      faltando.hidden = false;
      problemas[0].focus();
      return;
    }
    marca(1, "feito");
    await espera(250);

    let texto = modelo.innerHTML;
    marca(2, "feito");
    await espera(250);

    const genero = dados.ESTADO_CIVIL.endsWith("a") ? feminino : masculino;
    const valores = {
      ...dados,
      ...genero,
      DATA_EXTENSO: new Date().toLocaleDateString(ingles ? "en" : "pt-BR", { day: "numeric", month: "long", year: "numeric" }),
    };
    texto = texto.replace(/\{\{([A-Z_]+)\}\}/g, (marcador, nome) => (nome in valores ? `<mark>${escapa(valores[nome])}</mark>` : marcador));
    marca(3, "feito");
    await espera(250);

    saida.innerHTML = texto;
    saida.hidden = false;
    imprime.hidden = false;
    marca(4, "feito");
    const ms = Math.max(1, Math.round(performance.now() - inicio - 1000));
    tempo.textContent = modelo.dataset.tempo.replace("{ms}", ms);
    tempo.hidden = false;
  });

  imprime.addEventListener("click", () => print());
}
