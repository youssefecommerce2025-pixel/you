// Bandeau de consentement cookies (RGPD + Google Consent Mode v2).
//
// - Par defaut, TOUT est refuse (consentement prealable requis pour les cookies pub).
// - L'utilisateur peut Accepter, Refuser, ou Personnaliser (analytics / publicite).
// - Le choix est memorise 6 mois (localStorage) et re-demandable a tout moment.
// - Compatible Google Consent Mode v2 : met a jour gtag('consent', 'update', ...).
//
// Integration : ajoute simplement <script src="/cookies.js" defer></script> a tes pages,
// puis tes tags Google/Meta ne se declenchent qu'apres consentement (via l'evenement
// 'cookie-consent-updated' ou window.cookieConsent.get()).

(function () {
  var STORAGE_KEY = "cookie_consent_v1";
  var MAX_AGE_DAYS = 180;

  // --- Google Consent Mode v2 : etat par defaut = tout refuse -------------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data.ts || Date.now() - data.ts > MAX_AGE_DAYS * 864e5) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function save(consent) {
    var data = { ts: Date.now(), analytics: !!consent.analytics, ads: !!consent.ads };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    apply(data);
    return data;
  }

  function apply(data) {
    gtag("consent", "update", {
      analytics_storage: data.analytics ? "granted" : "denied",
      ad_storage: data.ads ? "granted" : "denied",
      ad_user_data: data.ads ? "granted" : "denied",
      ad_personalization: data.ads ? "granted" : "denied",
    });
    document.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: data })
    );
  }

  // API publique
  window.cookieConsent = {
    get: load,
    accept: function () { save({ analytics: true, ads: true }); hide(); },
    refuse: function () { save({ analytics: false, ads: false }); hide(); },
    set: function (c) { save(c); hide(); },
    open: function () { show(); },
  };

  var bannerEl = null;

  function hide() { if (bannerEl) bannerEl.style.display = "none"; }
  function show() { if (bannerEl) bannerEl.style.display = "block"; }

  function render() {
    bannerEl = document.createElement("div");
    bannerEl.className = "cc-banner";
    bannerEl.setAttribute("role", "dialog");
    bannerEl.setAttribute("aria-label", "Consentement aux cookies");
    bannerEl.innerHTML =
      '<div class="cc-inner">' +
      '<div class="cc-text">' +
      "<strong>Nous respectons votre vie privee</strong>" +
      "<p>Nous utilisons des cookies pour mesurer l'audience et, avec votre accord, pour nos campagnes publicitaires (Google, Meta, TikTok). " +
      'Vous pouvez accepter, refuser ou personnaliser. Voir notre <a href="/confidentialite.html">politique de confidentialite</a>.</p>' +
      "</div>" +
      '<div class="cc-actions">' +
      '<button class="cc-btn cc-btn--ghost" data-cc="customize">Personnaliser</button>' +
      '<button class="cc-btn cc-btn--ghost" data-cc="refuse">Tout refuser</button>' +
      '<button class="cc-btn cc-btn--primary" data-cc="accept">Tout accepter</button>' +
      "</div>" +
      '<div class="cc-custom" hidden>' +
      "<label><input type=\"checkbox\" id=\"cc-analytics\" /> Mesure d'audience (analytics)</label>" +
      '<label><input type="checkbox" id="cc-ads" /> Publicite / retargeting (Google, Meta, TikTok)</label>' +
      '<button class="cc-btn cc-btn--primary" data-cc="save">Enregistrer mes choix</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(bannerEl);

    bannerEl.addEventListener("click", function (e) {
      var action = e.target && e.target.getAttribute("data-cc");
      if (!action) return;
      if (action === "accept") window.cookieConsent.accept();
      else if (action === "refuse") window.cookieConsent.refuse();
      else if (action === "customize")
        bannerEl.querySelector(".cc-custom").hidden = false;
      else if (action === "save")
        window.cookieConsent.set({
          analytics: bannerEl.querySelector("#cc-analytics").checked,
          ads: bannerEl.querySelector("#cc-ads").checked,
        });
    });
  }

  function init() {
    render();
    var existing = load();
    if (existing) {
      apply(existing);
      hide();
    } else {
      show();
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
