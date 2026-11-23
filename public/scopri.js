/* Local guide: translations and page interactions. */
// IT/EN strings live in src/i18n/*.json and arrive here through /i18n.js.
const scopriTranslations = window.ICARO_I18N || { it: {}, en: {} };

      const applyScopriLanguage = (lang) => {
        const t = scopriTranslations[lang] || scopriTranslations.it;
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.dataset.i18n;
          if (t[key] === undefined) return;
          if (el.hasAttribute('data-i18n-html')) el.innerHTML = t[key];
          else el.textContent = t[key];
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
          const key = el.dataset.i18nAria;
          if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
        });
        document.documentElement.lang = lang;
        window.dispatchEvent(new CustomEvent('icaro:language', { detail: lang }));
      };

      // Menu toggle
      const toggle = document.querySelector('[data-menu-toggle]');
      if (toggle) {
        toggle.addEventListener('click', () => {
          const open = document.body.classList.toggle('menu-open');
          toggle.setAttribute('aria-expanded', String(open));
          toggle.setAttribute('aria-label', open
            ? (localStorage.getItem('siteLanguage') === 'en' ? 'Close menu' : 'Chiudi menu')
            : (localStorage.getItem('siteLanguage') === 'en' ? 'Open menu' : 'Apri menu'));
        });
      }

      // Language switcher
      const savedLang = document.documentElement.lang === 'en' ? 'en' : 'it';
      const langSwitcher = document.querySelector('[data-language-switcher]');

      applyScopriLanguage(savedLang);

      if (langSwitcher) {
        langSwitcher.classList.toggle('is-en', savedLang === 'en');
        langSwitcher.querySelectorAll('[data-lang]').forEach(btn => {
          const active = btn.dataset.lang === savedLang;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-pressed', String(active));
          btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            const alternate = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
            if (lang !== savedLang && alternate) {
              localStorage.setItem('siteLanguage', lang);
              window.location.href = new URL(alternate.href).pathname + window.location.hash;
              return;
            }
            localStorage.setItem('siteLanguage', lang);
            langSwitcher.classList.toggle('is-en', lang === 'en');
            langSwitcher.querySelectorAll('[data-lang]').forEach(b => {
              const a = b.dataset.lang === lang;
              b.classList.toggle('is-active', a);
              b.setAttribute('aria-pressed', String(a));
            });
            applyScopriLanguage(lang);
          });
        });
      }
