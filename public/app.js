// Front public : recupere le texte de consentement officiel, capture le contexte
// (URL exacte de la page) et envoie le lead avec le consentement opt-in.

const form = document.getElementById("lead-form");
const messageEl = document.getElementById("form-message");
const submitBtn = document.getElementById("submit-btn");
const consentLabel = document.getElementById("consent-label");
const legalList = document.getElementById("legal-notice");

let config = null;

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
  const payload = {
    ...data,
    consent_telephone: true,
    // On capture l'URL EXACTE de la page de capture (preuve de consentement).
    source_url: window.location.href,
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

loadConfig();
