/* =====================================================================
   BRUMPHOMET LIVES · Estudo de caso v2
   main.js

   Índice
     1. Configuração
     2. Ajudante: prender o foco (Tab circula dentro de um painel)
     3. Menu mobile (painel pela direita)
     4. Janelas de detalhes
     5. Imagem ampliada (lightbox)
     6. Seta de voltar ao topo (componente reutilizável)
     7. Item atual do menu
     8. Tradução automática (Google Tradutor)
     9. Imagens com reserva (data-fallback)
     10. Entrada suave dos blocos
   ===================================================================== */


/* =====================================================================
   INÍCIO: 1. CONFIGURAÇÃO
   ===================================================================== */
document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktop = window.matchMedia("(min-width: 1024px)");

/* Rolagem suave só para quem não pediu menos movimento */
const scrollBehavior = () => (reducedMotion.matches ? "auto" : "smooth");

/* Elementos que recebem foco pelo Tab */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
/* FIM: 1. CONFIGURAÇÃO */


/* =====================================================================
   INÍCIO: 2. AJUDANTE: PRENDER O FOCO
   Enquanto um painel está aberto, Tab e Shift+Tab circulam só dentro
   dele (WCAG 2.1.2: Esc sempre libera).
   ===================================================================== */
function trapFocus(container, event) {
  if (event.key !== "Tab") return;
  const items = [...container.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
/* FIM: 2. AJUDANTE: PRENDER O FOCO */

/* =====================================================================
   INÍCIO: 3. MENU MOBILE
   Abre pela lateral direita. Fecha ao clicar fora (fundo escurecido),
   ao clicar em um link, no botão Fechar ou com Esc.
   ===================================================================== */
const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("siteNav");
const navScrim = document.getElementById("navScrim");
const navClose = document.getElementById("navClose");

function isMenuOpen() {
  return navPanel.classList.contains("is-open");
}

function openMenu() {
  menuToggle.setAttribute("aria-expanded", "true");
  navScrim.hidden = false;
  requestAnimationFrame(() => navScrim.classList.add("is-visible"));
  navPanel.classList.add("is-open");
  document.body.classList.add("is-locked");
  /* Foco no primeiro link do menu */
  navPanel.querySelector(".nav-list a").focus();
}

function closeMenu(returnFocus = true) {
  if (!isMenuOpen()) return;
  menuToggle.setAttribute("aria-expanded", "false");
  navScrim.classList.remove("is-visible");
  navScrim.hidden = true;
  navPanel.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  if (returnFocus) menuToggle.focus();
}

/* Componente: botão hambúrguer */
menuToggle.addEventListener("click", () => (isMenuOpen() ? closeMenu() : openMenu()));

/* Componente: botão Fechar e fundo escurecido (clique fora) */
navClose.addEventListener("click", () => closeMenu());
navScrim.addEventListener("click", () => closeMenu());

/* Componente: links do menu fecham o painel */
navPanel.querySelectorAll(".nav-list a").forEach(link => {
  link.addEventListener("click", () => {
    if (!desktop.matches) closeMenu(false);
  });
});

/* Teclado: Esc fecha; Tab circula dentro do painel */
navPanel.addEventListener("keydown", event => {
  if (!isMenuOpen()) return;
  if (event.key === "Escape") closeMenu();
  trapFocus(navPanel, event);
});

/* Ao passar para o desktop, o painel some */
desktop.addEventListener("change", () => {
  if (desktop.matches) closeMenu(false);
});
/* FIM: 3. MENU MOBILE */


/* =====================================================================
   INÍCIO: 4. JANELAS DE DETALHES
   Botões com data-open="id" abrem o <dialog> com aquele id. O dialog
   nativo prende o foco e fecha com Esc; o foco volta ao botão.
   ===================================================================== */
let lastOpener = null;

document.querySelectorAll("[data-open]").forEach(button => {
  const dialog = document.getElementById(button.dataset.open);
  if (!dialog) return;
  button.addEventListener("click", () => {
    lastOpener = button;
    dialog.showModal();
    document.body.classList.add("is-locked");
  });
});

document.querySelectorAll("dialog.modal").forEach(dialog => {
  /* Componente: botão Fechar */
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());

  /* Clique no fundo escurecido fecha */
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  /* Ao fechar: libera a rolagem e devolve o foco */
  dialog.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    if (lastOpener) lastOpener.focus();
  });
});
/* FIM: 4. JANELAS DE DETALHES */


/* =====================================================================
   INÍCIO: 5. IMAGEM AMPLIADA (LIGHTBOX)
   Abre por cima da janela de detalhes. Esc ou Fechar voltam à miniatura.
   ===================================================================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");
let lastThumb = null;

document.querySelectorAll(".zoom[data-full]").forEach(thumb => {
  thumb.addEventListener("click", () => {
    const img = thumb.querySelector("img");
    lastThumb = thumb;
    lightboxImg.src = thumb.dataset.full;
    lightboxImg.alt = img ? img.alt : "";
    lightbox.showModal();
  });
});

lightbox.querySelector("[data-close]").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImg.removeAttribute("src");
  if (lastThumb) lastThumb.focus();
});
/* FIM: 5. IMAGEM AMPLIADA (LIGHTBOX) */


/* =====================================================================
   INÍCIO: 6. SETA DE VOLTAR AO TOPO (componente reutilizável)
   Para usar em outra página: copie o <button class="back-to-top">,
   a seção 11 do style.css e esta seção. Ela observa o fim de cada
   <section> da página, então não precisa de configuração.

   - Escondida por padrão.
   - Aparece (fade) quando a pessoa chega ao fim de uma section.
   - Ao clicar: volta ao topo, o foco vai para o título da página e a
     seta some quando o topo é alcançado.
   ===================================================================== */
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  const TOP_LIMIT = 80; // px do topo em que a seta some

  function showArrow() { backToTop.classList.add("is-visible"); }
  function hideArrow() { backToTop.classList.remove("is-visible"); }

  /* Componente: marcador invisível no fim de cada section */
  const endMarkers = [...document.querySelectorAll("main section")].map(section => {
    const marker = document.createElement("span");
    marker.className = "section-end";
    marker.setAttribute("aria-hidden", "true");
    section.appendChild(marker);
    return marker;
  });

  /* Quando um marcador entra na tela, a pessoa chegou ao fim daquela section */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && window.scrollY > TOP_LIMIT) showArrow();
    });
    endMarkers.forEach(marker => observer.observe(marker));
  }

  /* Some ao chegar ao topo (pelo clique ou rolando) */
  window.addEventListener("scroll", () => {
    if (window.scrollY <= TOP_LIMIT) hideArrow();
  }, { passive: true });

  /* Clique: volta ao topo e leva o foco ao título principal (teclado e leitor de tela) */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    const target = document.querySelector("h1") || document.getElementById("main");
    if (target) target.focus({ preventScroll: true });
    if (reducedMotion.matches) hideArrow();
  });
}
/* FIM: 6. SETA DE VOLTAR AO TOPO */


/* =====================================================================
   INÍCIO: 7. ITEM ATUAL DO MENU
   Marca com aria-current a seção que está na tela (cor + sublinhado).
   ===================================================================== */
const navLinks = [...document.querySelectorAll(".nav-list a")];
const navTargets = navLinks.map(link => document.querySelector(link.getAttribute("href")));

function markCurrent() {
  const line = window.innerHeight * 0.35;
  let current = -1;
  navTargets.forEach((section, i) => {
    if (section && section.getBoundingClientRect().top <= line) current = i;
  });
  navLinks.forEach((link, i) => {
    if (i === current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { markCurrent(); ticking = false; });
}, { passive: true });
markCurrent();
/* FIM: 7. ITEM ATUAL DO MENU */


/* =====================================================================
   INÍCIO: 8. TRADUÇÃO AUTOMÁTICA (GOOGLE TRADUTOR)
   API externa do Google Tradutor de sites:
   https://translate.google.com/translate_a/element.js
   O idioma escolhido fica no cookie "googtrans" (/pt/en ou /pt/de) e a
   página recarrega já traduzida. Trechos com translate="no" (marcas,
   códigos de cor) não são traduzidos. PT volta ao texto original.
   ===================================================================== */
const langButtons = document.querySelectorAll(".lang-switch button");
const currentLang = (document.cookie.match(/googtrans=\/pt\/(en|de)/) || [])[1] || "pt";
const HTML_LANG = { pt: "pt-BR", en: "en", de: "de" };

function setLang(lang) {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  if (lang === "pt") {
    document.cookie = `googtrans=; ${expired}`;
    if (location.hostname) document.cookie = `googtrans=; ${expired}; domain=${location.hostname}`;
  } else {
    document.cookie = `googtrans=/pt/${lang}; path=/`;
  }
  location.reload();
}

/* Componente: botões PT / EN / DE */
langButtons.forEach(button => {
  button.setAttribute("aria-pressed", String(button.dataset.lang === currentLang));
  button.addEventListener("click", () => {
    if (button.dataset.lang !== currentLang) setLang(button.dataset.lang);
  });
});

/* Carrega a API do Google só quando o idioma não é o português */
if (currentLang !== "pt") {
  document.documentElement.lang = HTML_LANG[currentLang];
  const holder = document.createElement("div");
  holder.id = "google_translate_element";
  holder.hidden = true;
  document.body.appendChild(holder);

  window.gtInit = () => new google.translate.TranslateElement(
    { pageLanguage: "pt", includedLanguages: "en,de", autoDisplay: false },
    "google_translate_element"
  );

  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=gtInit";
  document.body.appendChild(script);

  /* Termos com tradução fixa: translate="no" no HTML + texto de data-i18n-en / data-i18n-de */
  document.querySelectorAll(`[data-i18n-${currentLang}]`).forEach((el) => {
    el.textContent = el.getAttribute(`data-i18n-${currentLang}`);
    el.lang = currentLang;
  });
}
/* FIM: 8. TRADUÇÃO AUTOMÁTICA (GOOGLE TRADUTOR) */


/* =====================================================================
   INÍCIO: 9. IMAGENS COM RESERVA (data-fallback)
   Se uma imagem local não carregar, usa a do site original.
   ===================================================================== */
document.querySelectorAll("img[data-fallback]").forEach(img => {
  const useFallback = () => {
    if (img.src === img.dataset.fallback) return;
    img.src = img.dataset.fallback;
    const zoom = img.closest(".zoom[data-full]");
    if (zoom) zoom.dataset.full = img.dataset.fallback;
  };
  img.addEventListener("error", useFallback, { once: true });
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("loading") !== "lazy") useFallback();
});
/* FIM: 9. IMAGENS COM RESERVA */


/* =====================================================================
   INÍCIO: 10. ENTRADA SUAVE DOS BLOCOS
   Só com movimento permitido; sem suporte, tudo aparece direto.
   ===================================================================== */
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const blocks = document.querySelectorAll(".section__head, .card, .learnings, .cv-cta");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  blocks.forEach(block => { block.classList.add("reveal"); revealObserver.observe(block); });
}
/* FIM: 10. ENTRADA SUAVE DOS BLOCOS */
