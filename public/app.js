// Front public : récupère le texte de consentement officiel, capture le contexte
// (URL exacte de la page) et envoie le lead avec le consentement opt-in.
// Domaine : leads fibre / télécom Proximus (marché belge).

const form = document.getElementById("lead-form");
const messageEl = document.getElementById("form-message");
const submitBtn = document.getElementById("submit-btn");
const consentLabel = document.getElementById("consent-label");
const legalList = document.getElementById("legal-notice");

let config = null;
let variant = null;

function currentUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
    utm_term: p.get("utm_term") || undefined,
    utm_content: p.get("utm_content") || undefined,
  };
}

/* --------------------------------------------------------------------------
 * Validation client (miroir de src/leads.js)
 * ------------------------------------------------------------------------ */
function isBelgianPhoneClient(telephone) {
  let d = String(telephone || "").replace(/[\s.\-()/]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (/^32/.test(d)) d = "0" + d.slice(2);
  if (/^04\d{8}$/.test(d)) return true; // mobile
  if (/^0[1-9]\d{7}$/.test(d)) return true; // fixe
  return false;
}

function isBelgianPostalCodeClient(cp) {
  return /^[1-9]\d{3}$/.test(String(cp || "").trim());
}

function regionFromPostalCodeClient(cp) {
  const n = Number(String(cp || "").trim());
  if (!Number.isInteger(n) || n < 1000 || n > 9999) return null;
  if (n >= 1000 && n <= 1299) return "Bruxelles";
  if ((n >= 1300 && n <= 1499) || (n >= 4000 && n <= 7999)) return "Wallonie";
  return "Flandre";
}

// Détecte le slug de variante : /lp/<slug> ou ?v=<slug>
function variantSlug() {
  const m = window.location.pathname.match(/\/lp\/([a-z0-9-]+)/i);
  if (m) return m[1];
  return new URLSearchParams(window.location.search).get("v") || null;
}

async function loadVariant() {
  const slug = variantSlug();
  if (!slug) return;
  try {
    const res = await fetch("/api/variant/" + encodeURIComponent(slug));
    if (!res.ok) return;
    variant = await res.json();

    if (variant.title) document.getElementById("hero-title").textContent = variant.title;
    if (variant.subtitle) document.getElementById("hero-lead").textContent = variant.subtitle;
    if (Array.isArray(variant.bullets) && variant.bullets.length) {
      document.getElementById("hero-points").innerHTML = variant.bullets
        .map((b) => `<li>${b}</li>`)
        .join("");
    }
    // Préremplissage + attribution
    document.getElementById("f-region").value = variant.region || "";
    document.getElementById("f-persona").value = variant.persona || "";
    document.getElementById("f-source").value = "lp:" + variant.slug;
    if (variant.objectif) {
      const radio = form.querySelector(`[name="objectif"][value="${variant.objectif}"]`);
      if (radio) radio.checked = true;
    }
    if (variant.persona === "soho") {
      const t = form.querySelector('[name="type_client"][value="soho"]');
      if (t) t.checked = true;
    }
  } catch (e) {}
}

function setupWhatsApp() {
  const num = (variant && variant.whatsapp) || (config && config.whatsapp);
  const buttons = [document.getElementById("wa-cta"), document.getElementById("wa-float")].filter(
    Boolean
  );
  if (!buttons.length) return;
  buttons.forEach((btn) => (btn.hidden = false));
  if (!num) return;

  const msg =
    (variant && variant.wa_message) ||
    "Bonjour, je souhaite vérifier si la fibre Proximus est disponible à mon adresse.";
  const href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  buttons.forEach((btn) => {
    btn.href = href;
    btn.addEventListener("click", () => {
      const payload = {
        region: variant?.region || document.getElementById("f-region")?.value,
        persona: variant?.persona || document.getElementById("f-persona")?.value,
        variant: variant?.slug,
        source: variant ? "lp:" + variant.slug : "whatsapp",
        ...currentUtm(),
      };
      try {
        navigator.sendBeacon
          ? navigator.sendBeacon("/api/track/whatsapp", new Blob([JSON.stringify(payload)], { type: "application/json" }))
          : fetch("/api/track/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
      } catch (e) {}
    });
  });
}

// Boutons d'angle ("La fibre arrive / Mon débit chute / Je regroupe") :
// présélectionnent objectif + persona et amènent au formulaire.
function setupAngles() {
  const fPersona = document.getElementById("f-persona");
  document.querySelectorAll(".js-angle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const obj = btn.dataset.objectif;
      if (obj) {
        const radio = form.querySelector(`[name="objectif"][value="${obj}"]`);
        if (radio) radio.checked = true;
      }
      if (btn.dataset.persona && fPersona) fPersona.value = btn.dataset.persona;
      const devis = document.getElementById("devis");
      if (devis) devis.scrollIntoView({ behavior: "smooth", block: "start" });
      const cp = document.querySelector('#lead-form [name="code_postal"]');
      if (cp && !cp.value) setTimeout(() => cp.focus(), 400);
    });
  });
}

// Indice de région en direct sous le code postal.
function setupRegionHint() {
  const cp = form.querySelector('[name="code_postal"]');
  const hint = document.getElementById("region-hint");
  const fRegion = document.getElementById("f-region");
  if (!cp) return;
  cp.addEventListener("input", () => {
    const region = regionFromPostalCodeClient(cp.value);
    if (region) {
      if (fRegion && !fRegion.value) fRegion.value = region;
      else if (fRegion) fRegion.value = region;
      if (hint) {
        hint.textContent = "📍 " + region;
        hint.className = "field__hint field__hint--ok";
      }
    } else if (hint) {
      hint.textContent = "";
    }
  });
}

/** Formulaire multi-étapes : localisation → besoin → contact */
function setupMultiStep() {
  const steps = Array.from(document.querySelectorAll(".form-step"));
  if (!steps.length) return;
  const fill = document.getElementById("form-progress-fill");
  const numEl = document.getElementById("form-step-num");
  let current = 1;

  function showStep(n) {
    current = n;
    steps.forEach((s) => {
      const sn = Number(s.dataset.step);
      const on = sn === n;
      s.hidden = !on;
      s.classList.toggle("is-active", on);
    });
    if (fill) fill.style.width = `${(n / 3) * 100}%`;
    if (numEl) numEl.textContent = String(n);
    const active = document.querySelector(`.form-step[data-step="${n}"]`);
    const focusable = active?.querySelector("input, select, button.js-next-step, button[type=submit]");
    if (focusable) setTimeout(() => focusable.focus(), 150);
  }

  function validateStep(n) {
    if (n === 1) {
      const cp = form.querySelector('[name="code_postal"]');
      if (!cp?.value || !isBelgianPostalCodeClient(cp.value)) {
        showMessage("Merci d'indiquer un code postal belge (4 chiffres, ex. 1000 ou 4000).", "err");
        cp?.focus();
        return false;
      }
    }
    if (n === 3) {
      const prenom = form.querySelector('[name="prenom"]');
      const nom = form.querySelector('[name="nom"]');
      const tel = form.querySelector('[name="telephone"]');
      if (!prenom?.value?.trim() || !nom?.value?.trim() || !tel?.value?.trim()) {
        showMessage("Merci de remplir prénom, nom et téléphone.", "err");
        return false;
      }
    }
    showMessage("", "");
    return true;
  }

  document.querySelectorAll(".js-next-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = Number(btn.dataset.next);
      if (!validateStep(current)) return;
      showStep(next);
    });
  });
  document.querySelectorAll(".js-prev-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      showStep(Number(btn.dataset.prev));
      showMessage("", "");
    });
  });

  window.__goFormStep = showStep;
  showStep(1);
}

/** Cache la barre CTA mobile quand le formulaire est visible */
function setupMobileCta() {
  const bar = document.getElementById("mobile-cta");
  const devis = document.getElementById("devis");
  if (!bar || !devis || !window.IntersectionObserver) return;
  const io = new IntersectionObserver(
    ([entry]) => bar.classList.toggle("is-hidden", entry.isIntersecting),
    { threshold: 0.25 }
  );
  io.observe(devis);
}

function setupIslands() {
  const slug = variantSlug();
  document.querySelectorAll(".island").forEach((card) => {
    if (slug && card.dataset.slug === slug) card.classList.add("is-active");
  });
}

async function loadConfig() {
  try {
    const res = await fetch("/api/config");
    config = await res.json();

    consentLabel.textContent = config.consentCheckboxLabel;

    const brand = config.org?.marque;
    if (brand && brand[0] !== "[") {
      const bn = document.getElementById("brand-name");
      const fb = document.getElementById("footer-brand");
      if (bn) bn.textContent = brand;
      if (fb) fb.textContent = brand;
    }

    legalList.innerHTML = "";
    (config.informationNotice || []).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      legalList.appendChild(li);
    });
  } catch (e) {
    consentLabel.textContent =
      "J'accepte d'être contacté(e) par téléphone au sujet de mon éligibilité à la fibre.";
  }
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "form-message " + (type || "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("", "");

  if (!document.getElementById("consent_telephone").checked) {
    showMessage("Merci de cocher la case de consentement pour être rappelé(e) (obligatoire).", "err");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  if (!isBelgianPhoneClient(data.telephone)) {
    showMessage("Merci d'indiquer un numéro de téléphone belge valide (ex. 0470 12 34 56 ou 02 123 45 67).", "err");
    return;
  }
  if (!isBelgianPostalCodeClient(data.code_postal)) {
    showMessage("Merci d'indiquer un code postal belge (4 chiffres, 1000 à 9999).", "err");
    return;
  }

  if (!data.region) data.region = regionFromPostalCodeClient(data.code_postal) || "";

  const params = new URLSearchParams(window.location.search);
  const payload = {
    ...data,
    consent_telephone: true,
    source_url: window.location.href,
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours...";

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (!res.ok) {
      showMessage(result.error || "Une erreur est survenue.", "err");
    } else {
      form.reset();
      const prenom = encodeURIComponent(data.prenom || "");
      const mode = result.method === "double_optin" ? "&mode=double_optin" : "";
      window.location.href = `/merci.html?prenom=${prenom}${mode}`;
      return;
    }
  } catch (err) {
    showMessage("Impossible d'envoyer le formulaire. Réessayez.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Être rappelé(e) sous 15 min →";
  }
});

(async function init() {
  await Promise.all([loadConfig(), loadVariant()]);
  setupWhatsApp();
  setupAngles();
  setupRegionHint();
  setupIslands();
  setupMultiStep();
  setupMobileCta();
})();
