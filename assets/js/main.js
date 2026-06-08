/**
 * Main JavaScript for Free Fun Icebreaker Games.
 * Phase 1.2 — Improved error handling and performance.
 */

(function () {
  "use strict";

  /**
   * Render game cards from the shared icebreakerGames array.
   * @param {string} containerId - ID of the container element.
   * @param {Array} games - Array of game objects.
   */
  window.renderGameCards = function (containerId, games) {
    var container = document.getElementById(containerId);
    if (!container) { return; }
    if (!games || !games.length) {
      container.innerHTML = "";
      return;
    }

    container.textContent = "";

    var fragment = document.createDocumentFragment();

    games.forEach(function (game) {
      if (!game || !game.title) { return; }

      var card = document.createElement("div");
      card.className = "card";

      var icon = document.createElement("div");
      icon.className = "card-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = getGameIcon(game.slug);

      var title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = game.title;

      var desc = document.createElement("p");
      desc.className = "card-desc";
      desc.textContent = game.description || "";

      var meta = document.createElement("div");
      meta.className = "card-meta";

      if (game.bestFor) {
        var bestSpan = document.createElement("span");
        bestSpan.textContent = game.bestFor;
        meta.appendChild(bestSpan);
      }

      if (game.players) {
        var playersSpan = document.createElement("span");
        playersSpan.textContent = game.players;
        meta.appendChild(playersSpan);
      }

      if (game.time) {
        var timeSpan = document.createElement("span");
        timeSpan.textContent = game.time;
        meta.appendChild(timeSpan);
      }

      var link = document.createElement("a");
      link.className = "btn btn-primary";
      link.href = game.url || "#";
      link.textContent = "Play Game";
      link.setAttribute("aria-label", "Play " + game.title);

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(meta);
      card.appendChild(link);

      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  };

  /**
   * Render game cards with category-based filter buttons.
   * @param {string} containerId
   * @param {string} filterBarId
   * @param {Array} games
   */
  window.renderFilterableGames = function (containerId, filterBarId, games) {
    var container = document.getElementById(containerId);
    var filterBar = document.getElementById(filterBarId);
    if (!container || !filterBar) { return; }
    if (!games || !games.length) { return; }

    var categories = ["All", "Meetings", "Classrooms", "Remote Teams", "Parties", "Team Building"];

    filterBar.textContent = "";

    categories.forEach(function (cat, idx) {
      var btn = document.createElement("button");
      btn.className = "filter-btn" + (idx === 0 ? " active" : "");
      btn.textContent = cat;
      btn.setAttribute("data-filter", cat);
      btn.setAttribute("type", "button");

      btn.addEventListener("click", function () {
        var active = filterBar.querySelector(".filter-btn.active");
        if (active) { active.classList.remove("active"); }
        btn.classList.add("active");

        var filtered;
        if (cat === "All") {
          filtered = games;
        } else {
          var catLower = cat.toLowerCase().replace(" ", "-");
          filtered = games.filter(function (g) {
            return g.category === cat || (g.tags && g.tags.indexOf(catLower) !== -1);
          });
        }
        window.renderGameCards(containerId, filtered);
      });

      filterBar.appendChild(btn);
    });

    window.renderGameCards(containerId, games);
  };

  /**
   * Get an emoji icon for a game by slug.
   * @param {string} slug
   * @returns {string}
   */
  function getGameIcon(slug) {
    var icons = {
      "two-truths-and-a-lie": "🎭",
      "would-you-rather": "🤔",
      "this-or-that": "⚖️",
      "random-icebreaker-questions": "❓",
      "emoji-guessing-game": "😎"
    };
    return (slug && icons[slug]) ? icons[slug] : "🎲";
  }

  /**
   * Highlight the current page link in the nav.
   */
  (function highlightNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll(".nav-list a");

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) { return; }

      if (href === "/" && (path === "/" || path === "/index.html")) {
        link.classList.add("active");
        return;
      }

      if (path.endsWith(href)) {
        link.classList.add("active");
      }
    });
  })();

  /**
   * Mobile hamburger menu toggle.
   */
  (function initMobileMenu() {
    var toggle = document.getElementById("menuToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) { return; }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
    });
  })();

  /**
   * Dark mode toggle (session-only, no storage).
   */
  (function initDarkMode() {
    var themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) { return; }

    var html = document.documentElement;
    var isDark = false;

    themeBtn.addEventListener("click", function () {
      isDark = !isDark;
      html.setAttribute("data-theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "☀ Light" : "☾ Theme";
      themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
  })();

  /**
   * Back to Top button — shows after scrolling 300px.
   * Wrapped in DOMContentLoaded because the button HTML may appear
   * after this script in the document.
   */
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".back-to-top");
    if (!btn) { return; }

    var scrollTimeout;
    var toggleBtn = function () {
      if (window.scrollY > 300) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    };

    window.addEventListener("scroll", function () {
      if (scrollTimeout) { window.cancelAnimationFrame(scrollTimeout); }
      scrollTimeout = window.requestAnimationFrame(toggleBtn);
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Run once on load in case the page is already scrolled
    toggleBtn();
  });

})();
