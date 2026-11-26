# Portfólio de Gabriel Victor

Site pessoal em HTML, CSS e JavaScript puro, em português e inglês.

## Como abrir

Dê dois cliques em `index.html`. Para testar como em um site publicado:

```
py -3 -m http.server 8000
```

Depois abra http://localhost:8000.

## Estrutura

- `pt-BR/index.html`: site em português
- `en/index.html`: site em inglês
- `pt-BR/laboratorio.html` e `en/lab.html`: laboratório da matéria de Front-End, feito com Bootstrap 5
- `assets/css/style.css`: estilos e cores
- `assets/js/main.js`: menu, terminal interativo, fundo animado em canvas, Ctrl+K, números e dados ao vivo do GitHub e do dev.to, vídeos dos projetos, cópia do e-mail, modo retrô, jogo da cobrinha, linha do tempo, calendário de commits, cartão de visita e animações
- `assets/css/lab.css` e `assets/js/lab.js`: ajustes e interações do laboratório
- `assets/video/`: prévias em vídeo dos projetos
- `assets/img/`: foto e imagens dos projetos e QR codes do cartão de visita
- `assets/data/commits.json`: calendário de commits, atualizado todo dia por `.github/workflows/commits.yml`
- `assets/gabriel-victor.vcf`: contato para salvar no celular
- `assets/cv/`: currículo em PDF (português e inglês)
- `404.html`, `sitemap.xml`, `robots.txt`: página de erro e arquivos para buscadores

## Como atualizar

Cada idioma tem o próprio arquivo, então um texto novo precisa ser alterado em `pt-BR/index.html` e em `en/index.html`. Para incluir um projeto, copie um bloco `<article class="card project">` nos dois arquivos.

## Publicação

O site é estático e funciona no GitHub Pages ou no Cloudflare Pages. Se o endereço final não for `gabrielvictoraraujodacruz-create.github.io/portfolio-gabriel`, troque esse endereço nos três arquivos `index.html`.
