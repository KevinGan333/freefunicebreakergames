/**
 * Gentle Share — reusable sharing utilities.
 * Free Fun Icebreaker Games — Phase 1.4
 *
 * Philosophy: sharing must be optional, private, calm, and human.
 * No data is ever saved, stored, or transmitted.
 */

(function () {
  "use strict";

  /**
   * Build a gentle share text block.
   * @param {Object} options
   * @param {string} options.gameTitle  — Name of the game
   * @param {string} [options.prompt]   — Current prompt or question
   * @param {string} [options.response] — Optional user response
   * @param {string} [options.url]      — Game URL (defaults to current page)
   * @returns {string} Plain-text share message
   */
  window.createShareText = function (options) {
    if (!options || !options.gameTitle) { return ""; }

    var parts = [];

    parts.push("I tried “" + options.gameTitle + "” on Free Fun Icebreaker Games.");
    parts.push("");

    if (options.prompt) {
      parts.push("A small prompt:");
      parts.push(options.prompt);
      parts.push("");
    }

    if (options.response && typeof options.response === "string" && options.response.trim()) {
      parts.push("My pressure-free response:");
      parts.push(options.response.trim());
      parts.push("");
    }

    parts.push("Not perfect. Just shared.");
    parts.push("");
    parts.push("Play here:");
    parts.push(options.url || window.location.href);

    return parts.join("\n");
  };

  /**
   * Copy text to the clipboard with status feedback.
   * @param {string} text
   * @param {HTMLElement} statusElement — element to show status message
   */
  window.copyToClipboard = function (text, statusElement) {
    if (!text || typeof text !== "string") {
      if (statusElement) { statusElement.textContent = "Nothing to copy."; }
      return;
    }

    // Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (statusElement) { statusElement.textContent = "Copied to clipboard."; }
      }).catch(function () {
        fallbackCopy(text, statusElement);
      });
      return;
    }

    fallbackCopy(text, statusElement);
  };

  /**
   * Fallback clipboard copy using textarea + execCommand.
   */
  function fallbackCopy(text, statusElement) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.setAttribute("aria-hidden", "true");
    document.body.appendChild(textarea);

    // Save current selection
    var selected = document.activeElement;
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    try {
      var success = document.execCommand("copy");
      if (statusElement) {
        statusElement.textContent = success ? "Copied to clipboard." : "Copy failed. Please select and copy the text manually.";
      }
    } catch (e) {
      if (statusElement) {
        statusElement.textContent = "Copy failed. Please select and copy the text manually.";
      }
    }

    document.body.removeChild(textarea);

    // Restore focus
    if (selected && typeof selected.focus === "function") {
      selected.focus();
    }
  }

  /**
   * Use native share (mobile) or fall back to clipboard.
   * @param {Object} shareData  — { title, text, url } for navigator.share
   * @param {string} fallbackText — plain text for clipboard fallback
   * @param {HTMLElement} statusElement
   */
  window.nativeShareOrCopy = function (shareData, fallbackText, statusElement) {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).then(function () {
        if (statusElement) { statusElement.textContent = "Shared! Thank you for spreading gentle moments."; }
      }).catch(function (err) {
        // User cancelled — not an error, do nothing
        if (err && err.name === "AbortError") { return; }
        // Other error — fall back to clipboard
        if (fallbackText) {
          window.copyToClipboard(fallbackText, statusElement);
        }
      });
    } else {
      // Native share not available — use clipboard
      if (fallbackText) {
        window.copyToClipboard(fallbackText, statusElement);
        if (statusElement) {
          var current = statusElement.textContent;
          if (current === "Copied to clipboard.") {
            statusElement.textContent = "Sharing is not available in this browser, so the text was copied instead.";
          }
        }
      } else if (statusElement) {
        statusElement.textContent = "Sharing is not available in this browser.";
      }
    }
  };

  /**
   * Safely get text content from an element by selector.
   * @param {string} selector — CSS selector
   * @returns {string}
   */
  window.safelyGetTextFromElement = function (selector) {
    try {
      var el = document.querySelector(selector);
      return el ? el.textContent.trim() : "";
    } catch (e) {
      return "";
    }
  };

  /**
   * Clear a share status message element.
   * @param {HTMLElement} statusElement
   */
  window.clearShareStatus = function (statusElement) {
    if (statusElement) {
      statusElement.textContent = "";
    }
  };

})();
