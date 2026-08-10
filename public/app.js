// Front public : recupere le texte de consentement officiel, capture le contexte
// (URL exacte de la page) et envoie le lead avec le consentement opt-in.

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

// Detecte le slug de variante : /lp/<slug> ou ?v=<slug>
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
    // Pre-remplissage + attribution
    document.getElementById("f-ile").value = variant.ile || "";
    document.getElementById("f-persona").value = variant.persona || "";
    document.getElementById("f-source").value = "lp:" + variant.slug;
    if (variant.tranche_age) {
      const sel = document.querySelector('[name="tranche_age"]');
      if (sel) sel.value = variant.tranche_age;
    }
  } catch (e) {}
}

function setupWhatsApp() {
  const num = (variant && variant.whatsapp) || (config && config.whatsapp);
  const buttons = [document.getElementById("wa-cta"), document.getElementById("wa-float")].filter(
    Boolean
  );
  if (!buttons.length) return;

  // Toujours visibles (hero + bouton flottant).
  buttons.forEach((btn) => {
    btn.hidden = false;
  });

  if (!num) return;

  const msg =
    (variant && variant.wa_message) ||
    "Bonjour, je souhaite comparer les mutuelles sante et recevoir un devis.";
  const href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  buttons.forEach((btn) => {
    btn.href = href;
    btn.addEventListener("click", () => {
      const payload = {
        ile: variant?.ile,
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

// Boutons "Je suis senior / famille / fonctionnaire" : pre-selectionnent le profil
// et amenent au formulaire.
function setupSegments() {
  const personaSel = document.getElementById("persona-visible");
  const fPersona = document.getElementById("f-persona");
  const fSituation = document.getElementById("f-situation");
  const ageSel = document.querySelector('[name="tranche_age"]');

  function applyPersona(persona, age) {
    if (fPersona) fPersona.value = persona || "";
    if (fSituation) fSituation.value = persona || "";
    if (personaSel && persona) personaSel.value = persona;
    if (age && ageSel && !ageSel.value) ageSel.value = age;
  }

  if (personaSel) {
    personaSel.addEventListener("change", () => applyPersona(personaSel.value, ""));
  }

  document.querySelectorAll(".js-segment").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPersona(btn.dataset.persona, btn.dataset.age);
      const devis = document.getElementById("devis");
      if (devis) devis.scrollIntoView({ behavior: "smooth", block: "start" });
      const first = document.querySelector('#lead-form [name="prenom"]');
      if (first) setTimeout(() => first.focus(), 400);
    });
  });
}

async function loadConfig() {
  try {
    const res = await fetch("/api/config");
    config = await res.json();

    // Le libelle de la case opt-in vient du serveur (source de verite / versionne).
    consentLabel.textContent = config.consentCheckboxLabel;

    // Marque
    if (config.org?.siteComparateur && config.org.siteComparateur[0] !== "[") {
      document.getElementById("brand-name").textContent = config.org.siteComparateur;
      document.getElementById("footer-brand").textContent = config.org.siteComparateur;
    }

    // Mentions RGPD
    legalList.innerHTML = "";
    (config.informationNotice || []).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      legalList.appendChild(li);
    });
  } catch (e) {
    consentLabel.textContent =
      "J'accepte d'etre contacte(e) par telephone pour ma demande de mutuelle sante.";
  }
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "form-message " + type;
}

function isDomTomPhoneClient(telephone) {
  let d = String(telephone || "").replace(/[\s.\-()]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (/^0(?:590|690|691|596|696|697|594|694|262|692|693|269|639|508)\d{6}$/.test(d)) return true;
  if (/^590(?:590|690|691)\d{6}$/.test(d)) return true;
  if (/^596(?:596|696|697)\d{6}$/.test(d)) return true;
  if (/^594(?:594|694)\d{6}$/.test(d)) return true;
  if (/^262(?:262|692|693|269|639)\d{6}$/.test(d)) return true;
  if (/^508\d{6}$/.test(d)) return true;
  if (/^687\d{6}$/.test(d)) return true;
  if (/^689\d{8}$/.test(d)) return true;
  if (/^681\d{6}$/.test(d)) return true;
  return false;
}

function isDomTomPostalCodeClient(cp) {
  return /^(?:97[1-8]|98[6-8])\d{2}$/.test(String(cp || "").trim());
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("", "");

  const consentChecked = document.getElementById("consent_telephone").checked;
  if (!consentChecked) {
    showMessage(
      "Merci de cocher la case de consentement pour etre recontacte (obligatoire).",
      "err"
    );
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  if (!isDomTomPhoneClient(data.telephone)) {
    showMessage(
      "Merci d'indiquer un numéro de téléphone d'Outre-mer (DOM-TOM). Les numéros de métropole ne sont pas acceptés.",
      "err"
    );
    return;
  }
  if (!isDomTomPostalCodeClient(data.code_postal)) {
    showMessage(
      "Merci d'indiquer un code postal d'Outre-mer (971 à 978, ou 986 à 988).",
      "err"
    );
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const payload = {
    ...data,
    consent_telephone: true,
    // On capture l'URL EXACTE de la page de capture (preuve de consentement).
    source_url: window.location.href,
    // Attribution marketing (UTM) pour l'analytics de conversion.
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
      if (result.method === "double_optin") {
        window.location.href = `/merci.html?mode=double_optin&prenom=${prenom}`;
      } else {
        window.location.href = `/merci.html?prenom=${prenom}`;
      }
      return;
    }
  } catch (err) {
    showMessage("Impossible d'envoyer le formulaire. Reessayez.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Recevoir mon devis gratuit";
  }
});

(async function init() {
  await Promise.all([loadConfig(), loadVariant()]);
  setupWhatsApp();
  setupSegments();
})();
