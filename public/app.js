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
  const cta = document.getElementById("wa-cta");
  if (!num || !cta) return;
  const msg =
    (variant && variant.wa_message) ||
    "Bonjour, je souhaite comparer les mutuelles sante et recevoir un devis.";
  cta.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  cta.hidden = false;
  cta.addEventListener("click", () => {
    const payload = {
      ile: variant?.ile,
      persona: variant?.persona,
      variant: variant?.slug,
      source: variant ? "lp:" + variant.slug : "whatsapp",
      ...currentUtm(),
    };
    // Envoi non bloquant du tracking (n'empeche pas l'ouverture de WhatsApp)
    try {
      navigator.sendBeacon
        ? navigator.sendBeacon("/api/track/whatsapp", new Blob([JSON.stringify(payload)], { type: "application/json" }))
        : fetch("/api/track/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true });
    } catch (e) {}
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
      if (result.method === "double_optin") {
        showMessage(
          "Merci ! Un lien de confirmation vous a ete envoye. Confirmez-le pour finaliser votre demande.",
          "ok"
        );
      } else {
        showMessage(
          "Merci ! Votre demande est enregistree. Un conseiller vous rappellera rapidement.",
          "ok"
        );
      }
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
})();
