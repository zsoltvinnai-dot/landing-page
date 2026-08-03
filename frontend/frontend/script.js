const prices = {
  lash: [
    { name: "1D Classic — új szett", meta: "természetes, finom hatás · 120–150 perc", price: "19 900 Ft" },
    { name: "1D Classic — töltés", meta: "3 héten belül · min. 40% megtartással", price: "14 900 Ft" },
    { name: "2D Soft Volume — új szett", meta: "puha, hangsúlyos tekintet · 150–180 perc", price: "24 900 Ft" },
    { name: "2D Soft Volume — töltés", meta: "3 héten belül · min. 40% megtartással", price: "17 900 Ft" },
    { name: "3D Volume — új szett", meta: "dúsabb, mégis könnyű viselet", price: "29 900 Ft" },
    { name: "3D Volume — töltés", meta: "3 héten belül · min. 40% megtartással", price: "21 900 Ft" },
    { name: "4–5D Signature Volume", meta: "egyedi styling · 180 perc", price: "32 900 Ft" },
    { name: "Szempilla lifting + festés", meta: "6–8 hétig tartó természetes ív", price: "15 900 Ft" },
    { name: "Szakszerű leoldás", meta: "ápoló lezárással · 30 perc", price: "4 500 Ft" }
  ],
  brow: [
    { name: "Szemöldök formázás", meta: "csipesz / gyanta · 20 perc", price: "3 200 Ft" },
    { name: "Formázás + festés", meta: "szín- és formatervezéssel · 35 perc", price: "5 900 Ft" },
    { name: "Szemöldök laminálás", meta: "stylinggal és ápolással · 60 perc", price: "12 900 Ft" },
    { name: "Brow Signature", meta: "laminálás + styling + festés", price: "14 900 Ft" },
    { name: "Szempillafestés", meta: "önálló kiegészítő kezelés · 20 perc", price: "3 200 Ft" },
    { name: "Lash & Brow tint", meta: "szemöldök- és szempillafestés együtt", price: "5 900 Ft" }
  ],
  makeup: [
    { name: "Soft Day nappali smink", meta: "friss, természetes finish · 45 perc", price: "9 900 Ft" },
    { name: "Event Glow alkalmi smink", meta: "tartós, fotóbarát finish · 60–75 perc", price: "13 900 Ft" },
    { name: "Menyasszonyi próbasmink", meta: "konzultációval · 90 perc", price: "15 900 Ft" },
    { name: "Menyasszonyi smink", meta: "tartós pillákkal és touch-up csomaggal", price: "18 900 Ft" },
    { name: "Bridal Duo", meta: "próbasmink + a nagy nap sminkje", price: "31 900 Ft" },
    { name: "Egyéni sminktanácsadás", meta: "saját termékekre és rutinra szabva · 120 perc", price: "22 900 Ft" }
  ],
  creative: [
    { name: "Kreatív smink", meta: "egyedi koncepció és előzetes egyeztetés · 90–120 perc", price: "18 900 Ft-tól" },
    { name: "Editorial / fotózási smink", meta: "kamerára és koncepcióra tervezve · 90 perc", price: "19 900 Ft-tól" },
    { name: "Testfestés", meta: "koncepciótól és felülettől függően", price: "19 900 Ft / órától" },
    { name: "Csillámtetoválás", meta: "választott minta alapján", price: "2 500 Ft-tól" },
    { name: "Hennafestés", meta: "egyedi minta alapján", price: "3 900 Ft-tól" },
    { name: "Relax arcmasszázs", meta: "arc + nyak + dekoltázs · 45 perc", price: "9 900 Ft" }
  ],
  skin: [
    { name: "Hydro Glow", meta: "tervezett induló protokoll · 60 perc", price: "18 900 Ft" },
    { name: "Calm & Restore", meta: "érzékeny, vízhiányos bőrre · 60 perc", price: "19 900 Ft" },
    { name: "RF Lift", meta: "rádiófrekvenciás feszesítés · 60 perc", price: "21 900 Ft" },
    { name: "Deep Clean Ritual", meta: "személyre szabott mélytisztítás · 90 perc", price: "24 900 Ft" },
    { name: "Complex Skin Reset", meta: "gépi és manuális protokoll · 90 perc", price: "27 900 Ft" },
    { name: "Golden Age Premium", meta: "anti-aging luxusritus · 105 perc", price: "36 900 Ft" },
    { name: "Face Lifting masszázs", meta: "tervezett arc + nyak + dekoltázs kezelés · 60 perc", price: "14 900 Ft" }
  ]
};

const priceList = document.querySelector("#price-list");
const priceTabs = [...document.querySelectorAll(".price-tab")];

function renderPrices(category) {
  priceList.innerHTML = prices[category]
    .map(
      (item, index) => `
        <article class="price-row" style="animation-delay:${index * 45}ms">
          <div>
            <h3>${item.name}</h3>
            <p>${item.meta}</p>
          </div>
          <strong>${item.price}</strong>
        </article>`
    )
    .join("");
}

priceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    priceTabs.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    renderPrices(tab.dataset.category);
  });
});

renderPrices("lash");

const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 32), { passive: true });

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMenu() {
  document.body.classList.remove("menu-open");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  document.body.classList.toggle("menu-open", opening);
  mobileMenu.classList.toggle("is-open", opening);
  mobileMenu.setAttribute("aria-hidden", String(!opening));
  menuButton.setAttribute("aria-expanded", String(opening));
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)),
  { threshold: 0.16 }
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const storyCards = [...document.querySelectorAll(".story-card")];
const discNumber = document.querySelector(".disc-number");
const discCopy = document.querySelector(".disc-copy");
const loopDisc = document.querySelector(".loop-disc");

const storyObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    storyCards.forEach((card) => card.classList.toggle("is-active", card === visible.target));
    discNumber.textContent = visible.target.dataset.step;
    discCopy.innerHTML = visible.target.dataset.label.replace(" ", "<br>");
    const step = storyCards.indexOf(visible.target);
    loopDisc.style.transform = `rotateX(${8 + step * 2}deg) rotateY(${-9 + step * 6}deg) rotateZ(${step * 4}deg)`;
  },
  { rootMargin: "-28% 0px -28%", threshold: [0.25, 0.5, 0.75] }
);
storyCards.forEach((card) => storyObserver.observe(card));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const scene = document.querySelector("[data-tilt-scene]");
  scene.addEventListener("pointermove", (event) => {
    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 7}deg)`;
  });
  scene.addEventListener("pointerleave", () => (scene.style.transform = ""));

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(8px)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });

  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.1}px, ${(event.clientY - rect.top - rect.height / 2) * 0.1}px)`;
    });
    button.addEventListener("pointerleave", () => (button.style.transform = ""));
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
