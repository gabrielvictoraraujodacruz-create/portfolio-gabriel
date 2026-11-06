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
- `assets/css/style.css`: estilos e cores
- `assets/js/main.js`: menu, filtro de projetos, cópia do e-mail e animações
- `assets/img/`: foto e imagens dos projetos

## Como atualizar

Cada idioma tem o próprio arquivo, então um texto novo precisa ser alterado em `pt-BR/index.html` e em `en/index.html`. Para incluir um projeto, copie um bloco `<article class="card project">` nos dois arquivos.

## Publicação

O site é estático e funciona no GitHub Pages ou no Cloudflare Pages. Se o endereço final não for `gabrielvictoraraujodacruz-create.github.io/portfolio-gabriel`, troque esse endereço nos três arquivos `index.html`.
