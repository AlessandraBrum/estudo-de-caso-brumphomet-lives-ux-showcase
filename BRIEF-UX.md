# Brief de direção UX · Brumphomet Lives v2

Prompt usado para gerar esta versão compacta do estudo de caso. A versão original
(brumphomet-lives.vercel.app) continua intacta; esta pasta é uma alternativa.

## Papel

Aja como UX designer sênior revisando um estudo de caso de portfólio para recrutadores
e líderes de design que vão escanear a página em 2 a 3 minutos.

## Problema da versão atual

- Texto demais: cada seção tem vários parágrafos com o mesmo peso visual.
- Sem direção: 10 itens no menu, e a narrativa não deixa claro o problema, as decisões e o resultado.
- O leitor precisa ler tudo para entender o papel da autora.

## Objetivo

Uma página que se entende só pelos títulos, com a narrativa clássica de UX:
**problema → processo/identidade → soluções → resultados → aprendizados**.

## Regras de conteúdo

1. Usar somente fatos que já estão no estudo de caso original. Nada de métricas, depoimentos
   ou números novos.
2. Cada seção tem: número + categoria, um título-frase (a ideia em 3 a 5 palavras), no máximo
   2 frases de apoio, e cards curtos.
3. O título de cada card diz o tema; a descrição tem uma frase.
4. Detalhes (motivação, referências, configurações, registros) abrem em janelas (`<dialog>`)
   pelos botões "Ver detalhes", para os cards nunca crescerem nem deixarem um vizinho vazio.
   Leitura principal sempre visível; aprofundamento opcional.
5. Soluções seguem o padrão **Problema → Solução** em uma linha cada.
6. Evidências de resultado ficam rotuladas como "Evidência · registro anonimizado (LGPD)".
7. Menu com 5 itens: Visão geral, Identidade, Soluções, Resultados, Aprendizados.

## Regras visuais (Brumphomet Design System v1.0)

- Gótico rosa e preto: fundo #111111, superfícies #1A1418, vinho #2A0E1F, rosa #E51C78 só em
  títulos grandes e contornos, #FF5C9E para texto rosa pequeno e links.
- Manrope para toda a interface. ArtDystopia II apenas no logotipo (imagem original).
- Layout da referência: título da seção à esquerda (4 colunas) e cards à direita (8 colunas);
  no celular, tudo em uma coluna.
- Imagens: só registros reais do projeto. Nada de ilustrações geradas apresentadas como material do case.
- Um único botão primário por tela. Brilho rosa apenas em hover/foco.

## Regras de acessibilidade (WCAG 2.2 AA)

- Um h1, um h2 por seção, h3 nos cards; número e categoria fora do título.
- Link "Pular para o conteúdo", foco visível (2px #FF5C9E, afastamento 3px).
- Alvos de toque de 44px (48px no celular). Menu mobile com aria-expanded, Esc e retorno do foco.
- Janelas de detalhes em dialog nativo (Esc fecha, foco volta ao botão); item de menu atual com aria-current e sublinhado.
- Seletor PT / EN / DE com o mesmo mecanismo do original (Google Tradutor via cookie googtrans),
  nomes completos acessíveis e lang em cada botão; marcas com translate="no".
- Lightbox de imagens em dialog nativo (Esc fecha, foco volta à miniatura).
- prefers-reduced-motion: sem animações nem rolagem suave. Reflow sem rolagem horizontal em 320px.

Ver também: PROMPT-ACESSIBILIDADE.md e PROMPT-RESPONSIVIDADE.md.
