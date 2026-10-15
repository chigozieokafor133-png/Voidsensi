/* VOID'S SENSI'S — shared front-end enhancements */
(function () {
  'use strict';
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    // Every tool card is clickable anywhere inside its border.
    document.querySelectorAll('.tool-card').forEach(function (card) {
      const link = card.querySelector('a[href]');
      if (!link || card.dataset.voidEnhanced) return;
      card.dataset.voidEnhanced = '1';
      card.style.cursor = 'pointer';
      card.tabIndex = 0;
      card.addEventListener('click', function (e) {
        if (e.target.closest('a,button,input,select,textarea,label,[contenteditable="true"]')) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        window.location.assign(link.href);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); link.click(); }
      });
    });

    // Theme choice persists across all pages.
    const themeKey = 'voids-sensis-theme';
    const validThemes = ['purple', 'cyan', 'red', 'green'];
    let saved = 'purple';
    try { saved = localStorage.getItem(themeKey) || 'purple'; } catch (_) {}
    if (!validThemes.includes(saved)) saved = 'purple';
    document.documentElement.dataset.voidTheme = saved;

    document.querySelectorAll('[data-void-choice]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.voidChoice === saved));
      btn.addEventListener('click', function () {
        const theme = validThemes.includes(btn.dataset.voidChoice) ? btn.dataset.voidChoice : 'purple';
        document.documentElement.dataset.voidTheme = theme;
        try { localStorage.setItem(themeKey, theme); } catch (_) {}
        document.querySelectorAll('[data-void-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.voidChoice === theme)));
      });
    });

    // Add a Node API status badge to every page.
    if (!document.querySelector('[data-void-api-status]')) {
      const badge = document.createElement('div');
      badge.className = 'void-api-status';
      badge.dataset.voidApiStatus = '';
      badge.textContent = '● CONNECTING API';
      document.body.appendChild(badge);
    }
  });
})();
