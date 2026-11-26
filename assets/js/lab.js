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
