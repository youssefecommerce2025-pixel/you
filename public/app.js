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

function showSocialMsg(text, type) {
  const el = document.getElementById("social-fill-msg");
  if (!el) return;
  el.textContent = text || "";
  el.className = "form-message" + (type ? " " + type : "");
}

/** Préremplit uniquement les champs autorisés (jamais profil ni mutuelle). */
function applySocialProfile(profile, provider) {
  const setVal = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el || el.getAttribute("data-manual-only") === "1") return;
    if (value == null || value === "") return;
    el.value = value;
  };

  setVal("prenom", profile.prenom);
  setVal("nom", profile.nom);
  setVal("email", profile.email);
  if (profile.civilite) setVal("civilite", profile.civilite);
  setVal("date_naissance", profile.date_naissance);
  setVal("code_postal", profile.code_postal);

  const socialField = document.getElementById("f-social-login");
  if (socialField) socialField.value = provider || "";

  const missing = [];
  if (!profile.date_naissance) missing.push("date de naissance");
  if (!profile.code_postal) missing.push("code postal");
  const extra =
    missing.length > 0
      ? ` Merci de compléter aussi : ${missing.join(" et ")}.`
      : "";

  showSocialMsg(
    "Informations préremplies." +
      extra +
      " Votre profil et votre mutuelle actuelle restent à remplir.",
    "ok"
  );

  // Focus sur le premier champ manuel à remplir
  const manual = form.querySelector('[data-manual-only="1"]');
  if (manual) setTimeout(() => manual.focus(), 200);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** Convertit une date Google/Facebook en YYYY-MM-DD si possible. */
function toIsoDate(input) {
  if (!input) return "";
  if (typeof input === "string") {
    // Facebook : MM/DD/YYYY
    const m = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return `${m[3]}-${pad2(m[1])}-${pad2(m[2])}`;
    // Déjà ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
    return "";
  }
  if (typeof input === "object" && input.year && input.month && input.day) {
    return `${input.year}-${pad2(input.month)}-${pad2(input.day)}`;
  }
  return "";
}

function extractGooglePostalCode(addresses) {
  if (!Array.isArray(addresses)) return "";
  for (const a of addresses) {
    const cp = String(a.postalCode || a.postal_code || "").trim();
    if (cp) return cp;
  }
  return "";
}

function extractGoogleBirthday(birthdays) {
  if (!Array.isArray(birthdays)) return "";
  for (const b of birthdays) {
    const iso = toIsoDate(b.date);
    if (iso) return iso;
  }
  return "";
}

async function fetchGooglePeople(accessToken) {
  const fields = "names,emailAddresses,birthdays,addresses";
  const res = await fetch(
    `https://people.googleapis.com/v1/people/me?personFields=${encodeURIComponent(fields)}`,
    { headers: { Authorization: "Bearer " + accessToken } }
  );
  if (!res.ok) {
    // Repli userinfo si People API non activee
    const uRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const u = await uRes.json();
    return {
      prenom: u.given_name || (u.name || "").split(" ")[0] || "",
      nom: u.family_name || (u.name || "").split(" ").slice(1).join(" ") || "",
      email: u.email || "",
      date_naissance: "",
      code_postal: "",
    };
  }
  const p = await res.json();
  const name =
    (p.names || []).find((n) => n.metadata?.primary) || (p.names || [])[0] || {};
  const email =
    (p.emailAddresses || []).find((e) => e.metadata?.primary)?.value ||
    (p.emailAddresses || [])[0]?.value ||
    "";
  return {
    prenom: name.givenName || "",
    nom: name.familyName || "",
    email,
    date_naissance: extractGoogleBirthday(p.birthdays),
    code_postal: extractGooglePostalCode(p.addresses),
  };
}

function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) return resolve();
    const s = document.createElement("script");
    if (id) s.id = id;
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Script indisponible : " + src));
    document.head.appendChild(s);
  });
}

function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

async function loginWithGoogle() {
  const clientId = config?.googleClientId;
  if (!clientId) {
    showSocialMsg(
      "Gmail n'est pas encore configuré (GOOGLE_CLIENT_ID). Ajoutez la clé dans Hostinger / .env.",
      "err"
    );
    return;
  }
  await loadScript("https://accounts.google.com/gsi/client", "google-gsi");

  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.addresses.read",
  ].join(" ");

  await new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: async (tokenResponse) => {
          if (!tokenResponse.access_token) {
            showSocialMsg("Connexion Google annulée.", "err");
            return reject(new Error("cancel"));
          }
          try {
            const profile = await fetchGooglePeople(tokenResponse.access_token);
            applySocialProfile(profile, "gmail");
            resolve();
          } catch (e) {
            showSocialMsg("Erreur lors de la récupération du profil Google.", "err");
            reject(e);
          }
        },
      });
      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (e) {
      showSocialMsg("Connexion Google indisponible pour le moment.", "err");
      reject(e);
    }
  });
}

async function loginWithMeta(providerLabel) {
  const appId = config?.facebookAppId;
  if (!appId) {
    showSocialMsg(
      "Facebook n'est pas encore configuré (FACEBOOK_APP_ID). Ajoutez la clé Meta dans Hostinger / .env.",
      "err"
    );
    return;
  }

  window.fbAsyncInit = function () {
    window.FB.init({ appId, cookie: true, xfbml: false, version: "v21.0" });
  };
  if (!window.FB) {
    await loadScript("https://connect.facebook.net/fr_FR/sdk.js", "facebook-jssdk");
    if (window.FB) window.FB.init({ appId, cookie: true, xfbml: false, version: "v21.0" });
  }

  await new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (!response.authResponse) {
          showSocialMsg("Connexion annulée.", "err");
          return reject(new Error("cancel"));
        }
        // birthday : permission user_birthday (review Meta parfois requise)
        // location : rarement un CP ; on tente quand meme
        window.FB.api(
          "/me",
          { fields: "first_name,last_name,email,name,birthday,location" },
          (u) => {
            if (!u || u.error) {
              showSocialMsg("Impossible de lire le profil Meta.", "err");
              return reject(new Error("api"));
            }
            let code_postal = "";
            // Si Meta renvoie un CP dans un champ libre (rare), on le capture
            if (u.location && typeof u.location === "object") {
              const locName = String(u.location.name || "");
              const m = locName.match(/\b(97[1-8]\d{2}|98[6-8]\d{2})\b/);
              if (m) code_postal = m[1];
            }
            applySocialProfile(
              {
                prenom: u.first_name || (u.name || "").split(" ")[0] || "",
                nom: u.last_name || (u.name || "").split(" ").slice(1).join(" ") || "",
                email: u.email || "",
                date_naissance: toIsoDate(u.birthday || ""),
                code_postal,
              },
              providerLabel
            );
            resolve();
          }
        );
      },
      { scope: "public_profile,email,user_birthday,user_location" }
    );
  });
}

function setupSocialFill() {
  const g = document.getElementById("btn-google");
  const f = document.getElementById("btn-facebook");
  const t = document.getElementById("btn-tiktok");
  if (g) {
    g.addEventListener("click", async () => {
      showSocialMsg("Connexion Gmail…", "");
      try {
        await loginWithGoogle();
      } catch (e) {}
    });
  }
  if (f) {
    f.addEventListener("click", async () => {
      showSocialMsg("Connexion Facebook…", "");
      try {
        await loginWithMeta("facebook");
      } catch (e) {}
    });
  }
  if (t) {
    t.addEventListener("click", () => {
      if (!config?.tiktokEnabled) {
        showSocialMsg(
          "TikTok n'est pas encore configuré (TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET).",
          "err"
        );
        return;
      }
      showSocialMsg("Redirection vers TikTok…", "");
      window.location.href = "/api/auth/tiktok/start";
    });
  }

  // Retour OAuth TikTok
  const params = new URLSearchParams(window.location.search);
  const err = params.get("social_error");
  if (err) {
    showSocialMsg(err, "err");
  }
  const prefill = params.get("social_prefill");
  if (prefill) {
    try {
      const b64 = prefill.replace(/-/g, "+").replace(/_/g, "/");
      const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
      const json = JSON.parse(atob(b64 + pad));
      applySocialProfile(json, json.provider || "tiktok");
      // Nettoie l'URL
      params.delete("social_prefill");
      params.delete("social_error");
      const clean =
        window.location.pathname +
        (params.toString() ? "?" + params.toString() : "") +
        "#devis";
      window.history.replaceState({}, "", clean);
    } catch (e) {
      showSocialMsg("Impossible de lire le profil TikTok.", "err");
    }
  }
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
  setupSocialFill();
  setupIslands();
})();
