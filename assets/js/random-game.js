/**
 * Random game picker logic.
 * Phase 1.2 — Added error handling and duplicate prevention.
 */

(function () {
  "use strict";

  var btnPick = document.getElementById("btnPickRandom");
  var result = document.getElementById("randomResult");

  if (!btnPick || !result) { return; }

  var lastIdx = -1;

  btnPick.addEventListener("click", function () {
    // Validate games data
    if (typeof icebreakerGames === "undefined" || !icebreakerGames || !icebreakerGames.length) {
      return;
    }

    // Pick a random game, avoiding the same one twice in a row when possible
    var idx;
    if (icebreakerGames.length === 1) {
      idx = 0;
    } else {
      do {
        idx = Math.floor(Math.random() * icebreakerGames.length);
      } while (idx === lastIdx);
    }
    lastIdx = idx;

    var game = icebreakerGames[idx];
    if (!game) { return; }

    // Safely set text content for each element
    var el;
    el = document.getElementById("resultTitle");
    if (el) { el.textContent = game.title || ""; }

    el = document.getElementById("resultDesc");
    if (el) { el.textContent = game.description || ""; }

    el = document.getElementById("resultBestFor");
    if (el) { el.textContent = game.bestFor || ""; }

    el = document.getElementById("resultPlayers");
    if (el) { el.textContent = game.players || ""; }

    el = document.getElementById("resultTime");
    if (el) { el.textContent = game.time || ""; }

    var playBtn = document.getElementById("resultPlayBtn");
    if (playBtn) {
      playBtn.href = game.url || "#";
      playBtn.setAttribute("aria-label", "Play " + (game.title || "game"));
    }

    result.classList.add("visible");

    // Scroll result into view on mobile
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
