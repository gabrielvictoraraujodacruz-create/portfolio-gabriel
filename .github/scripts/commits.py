import json
import re
import urllib.request

USUARIO = "gabrielvictoraraujodacruz-create"
DESTINO = "assets/data/commits.json"

pedido = urllib.request.Request(
    f"https://github.com/users/{USUARIO}/contributions",
    headers={"User-Agent": "portfolio-commits"},
)
html = urllib.request.urlopen(pedido, timeout=30).read().decode("utf-8")

celulas = {}
for td in re.findall(r"<td[^>]*data-date[^>]*>", html):
    data = re.search(r'data-date="([\d-]+)"', td).group(1)
    nivel = int(re.search(r'data-level="(\d)"', td).group(1))
    ident = re.search(r'id="([^"]+)"', td).group(1)
    celulas[ident] = [data, 0, nivel]

for ident, texto in re.findall(r'<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)', html):
    numero = re.match(r"\s*(\d+) contribution", texto)
    if ident in celulas and numero:
        celulas[ident][1] = int(numero.group(1))

dias = sorted(celulas.values())
assert len(dias) > 300, f"poucos dias lidos: {len(dias)}"
assert all(n == 0 for _, n, nivel in dias if nivel == 0)

with open(DESTINO, "w", encoding="utf-8", newline="\n") as arquivo:
    json.dump({"total": sum(n for _, n, _ in dias), "dias": dias}, arquivo, separators=(",", ":"))
    arquivo.write("\n")
print(len(dias), "dias,", sum(n for _, n, _ in dias), "contribuições")
