"use strict";

/* Nav-bar Event Listeners */

const hamburgerBtn = document.querySelector(".hamburger-btn");
const navBar = document.querySelector("#nav-bar");

hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("active");
  navBar.classList.toggle("hamburger-btn__open");

  setNavAttributes();
});

document.addEventListener("click", (e) => {
  if (
    !navBar.classList.contains("hamburger-btn__open") ||
    e.target === navBar ||
    e.target === hamburgerBtn
  )
    return;

  navBar.classList.remove("hamburger-btn__open");
  hamburgerBtn.classList.remove("active");

  setNavAttributes();
});

function setNavAttributes() {
  const navLinks = document.querySelectorAll("#nav-bar a");
  const navBarHasActiveClass = navBar.classList.contains("hamburger-btn__open");

  navBar.setAttribute("aria-hidden", String(!navBarHasActiveClass));
  hamburgerBtn.setAttribute("aria-expanded", String(navBarHasActiveClass));

  navLinks.forEach((link) => {
    link.tabIndex = navBarHasActiveClass ? 0 : -1;
  });
}

/* Hide the Aside section for smaller screens */

const mediaQuery = window.matchMedia("(max-width: 700px)");

function hideAside() {
  const asideSection = document.querySelector("#pg1-aside-foraging");

  if (!asideSection) return;

  if (mediaQuery.matches) {
    asideSection.classList.add("hidden");
    asideSection.setAttribute("aria-hidden", "true");
  } else {
    asideSection.classList.remove("hidden");
    asideSection.removeAttribute("aria-hidden");
  }
}
hideAside();

mediaQuery.addEventListener("change", hideAside);

/* 'Get to know your mushroom' filter section */

const cards = document.querySelectorAll(".select-list-card");
const seasonalFilter = document.querySelector("#season");
const typeFilter = document.querySelector("#type");
const noMatchesMessage = document.querySelector(".no-matches");

const currentFilter = {
  season: "all",
  type: "all",
};

function updateFilter(e) {
  const currentType = e.target.name;

  currentFilter[currentType] = e.target.value;

  if (!document.startViewTransition) {
    filterCards();
    return;
  }

  document.startViewTransition(() => filterCards());
}

seasonalFilter?.addEventListener("change", updateFilter);
typeFilter?.addEventListener("change", updateFilter);

function filterCards() {
  let hasVisibleCards = false;

  cards.forEach((card, index) => {
    const dataType = card.querySelector("[data-type]").dataset.type;
    const dataSeason = card.querySelector("[data-season]").dataset.season;
    const doesSeasonMatch = dataSeason === currentFilter.season;
    const doesTypeMatch = dataType === currentFilter.type;
    const isSeasonValueAll = currentFilter.season === "all";
    const isTypeValueAll = currentFilter.type === "all";
    const cardUniqueId = `uniqueID-${index + 1}`;

    card.style.viewTransitionName = `card-${cardUniqueId}`;

    if (
      (doesTypeMatch && doesSeasonMatch) ||
      (isSeasonValueAll && doesTypeMatch) ||
      (isTypeValueAll && doesSeasonMatch) ||
      (isSeasonValueAll && isTypeValueAll)
    ) {
      hasVisibleCards = true;
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }

    if (!hasVisibleCards) {
      noMatchesMessage.classList.remove("hidden");
    } else {
      noMatchesMessage.classList.add("hidden");
    }
  });
}

localStorage