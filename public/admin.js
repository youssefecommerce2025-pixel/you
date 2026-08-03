// CRM de qualification (Point 2). Auth par token Bearer, liste/filtre des leads,
// mise a jour du statut/qualification, et export de la preuve de consentement.

const STORAGE_KEY = "crm_token";
let token = sessionStorage.getItem(STORAGE_KEY) || "";

const el = (id) => document.getElementById(id);
const loginEl = el("login");
const dashboardEl = el("dashboard");

const STATUT_LABELS = {
  nouveau: "Nouveau",
  a_rappeler: "A rappeler",
  qualifie: "Qualifie",
  non_joignable: "Non joignable",
  non_interesse: "Non interesse",
  transmis: "Transmis",
  rejete: "Rejete",
};

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    logout();
    throw new Error("Non autorise");
  }
  return res.json();
}

function showDashboard() {
  loginEl.hidden = true;
  dashboardEl.hidden = false;
  loadStats();
  loadLeads();
}

function logout() {
  token = "";
  sessionStorage.removeItem(STORAGE_KEY);
  dashboardEl.hidden = true;
  loginEl.hidden = false;
}

async function login() {
  token = el("token-input").value.trim();
  if (!token) return;
  const stats = await api("/api/admin/stats").catch(() => null);
  if (!stats) {
    el("login-error").textContent = "Token invalide.";
    el("login-error").className = "form-message err";
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, token);
  showDashboard();
}

async function loadStats() {
  const { total, parStatut } = await api("/api/admin/stats");
  const map = Object.fromEntries((parStatut || []).map((r) => [r.statut, r.n]));
  const cards = [
    { label: "Total leads", value: total },
    { label: "Nouveau", value: map.nouveau || 0 },
    { label: "A rappeler", value: map.a_rappeler || 0 },
    { label: "Qualifie", value: map.qualifie || 0 },
    { label: "Transmis", value: map.transmis || 0 },
  ];
  el("stats").innerHTML = cards
    .map((c) => `<div class="stat"><b>${c.value}</b><span>${c.label}</span></div>`)
    .join("");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

async function loadLeads() {
  const statut = el("filter-statut").value;
  const q = el("search").value.trim();
  const params = new URLSearchParams();
  if (statut) params.set("statut", statut);
  if (q) params.set("q", q);
  const { leads } = await api("/api/admin/leads?" + params.toString());

  el("leads-body").innerHTML = (leads || [])
    .map((l) => {
      const date = new Date(l.created_at).toLocaleString("fr-FR");
      const profil = [l.tranche_age, l.persona]
        .filter(Boolean)
        .join(" · ");
      const consent =
        l.double_optin_confirme || true
          ? `<span class="consent-ok">Opt-in ✓</span>`
          : `<span class="consent-wait">En attente</span>`;
      return `
        <tr>
          <td>${l.id}</td>
          <td>${esc(date)}</td>
          <td><strong>${esc(l.civilite || "")} ${esc(l.prenom)} ${esc(l.nom)}</strong><br><small>${esc(l.code_postal || "")}</small></td>
          <td>${esc(l.telephone)}<br><small>${esc(l.email)}</small></td>
          <td>${esc(profil || "—")}</td>
          <td class="score">${l.score ?? 0}</td>
          <td><span class="pill pill--${l.statut}">${STATUT_LABELS[l.statut] || l.statut}</span></td>
          <td>${consent}</td>
          <td><button class="link-btn" data-id="${l.id}">Qualifier</button></td>
        </tr>`;
    })
    .join("");

  document.querySelectorAll(".link-btn[data-id]").forEach((b) => {
    b.addEventListener("click", () => openPanel(Number(b.dataset.id)));
  });
}

async function openPanel(id) {
  const { leads } = await api("/api/admin/leads?");
  const lead = (leads || []).find((l) => l.id === id);
  if (!lead) return;
  const consent = await api(`/api/admin/leads/${id}/consent`).catch(() => null);
  const deliveries = await api(`/api/admin/leads/${id}/deliveries`).catch(() => ({ deliveries: [] }));

  el("panel-title").textContent = `${lead.prenom} ${lead.nom} (#${lead.id})`;

  const optSel = (name, current, opts) =>
    `<select data-field="${name}">${opts
      .map(
        (o) =>
          `<option value="${o.v}" ${o.v === (current || "") ? "selected" : ""}>${o.t}</option>`
      )
      .join("")}</select>`;

  el("panel-body").innerHTML = `
    <dl class="kv">
      <dt>Telephone</dt><dd>${esc(lead.telephone)}</dd>
      <dt>Email</dt><dd>${esc(lead.email)}</dd>
      <dt>Code postal</dt><dd>${esc(lead.code_postal || "—")}</dd>
      <dt>Recu le</dt><dd>${esc(new Date(lead.created_at).toLocaleString("fr-FR"))}</dd>
      <dt>Score</dt><dd><strong>${lead.score ?? 0}/100</strong></dd>
    </dl>

    <div class="grp">
      <label>Statut</label>
      ${optSel(
        "statut",
        lead.statut,
        Object.entries(STATUT_LABELS).map(([v, t]) => ({ v, t }))
      )}
    </div>

    <div class="grp">
      <label>Date de naissance${lead.tranche_age ? ` (tranche : ${esc(lead.tranche_age)})` : ""}</label>
      <input type="date" data-field="date_naissance" value="${esc(lead.date_naissance || "")}" />
    </div>

    <div class="grp">
      <label>Profil</label>
      ${optSel("persona", lead.persona, [
        { v: "", t: "—" },
        { v: "senior", t: "Senior" },
        { v: "famille", t: "Famille" },
        { v: "fonctionnaire", t: "Fonctionnaire / Indépendant" },
      ])}
    </div>

    <div class="grp">
      <label>A une mutuelle actuellement&nbsp;?</label>
      ${optSel("mutuelle_actuelle", lead.mutuelle_actuelle, [
        { v: "", t: "—" },
        { v: "oui", t: "Oui" },
        { v: "non", t: "Non" },
      ])}
    </div>

    <div class="grp">
      <label>Assigne a (conseiller)</label>
      <input data-field="assigne_a" value="${esc(lead.assigne_a || "")}" />
    </div>

    <div class="grp">
      <label>Courtier ORIAS destinataire</label>
      <input data-field="courtier_orias" value="${esc(lead.courtier_orias || "")}" placeholder="Nom / n° ORIAS" />
    </div>

    <div class="grp">
      <label>Notes</label>
      <textarea data-field="notes">${esc(lead.notes || "")}</textarea>
    </div>

    <button class="btn btn--primary" id="save-lead">Enregistrer</button>

    <div class="grp" style="margin-top:18px">
      <button class="btn btn--ghost" id="transmit-lead" style="width:100%">
        Transmettre au courtier partenaire (webhook)
      </button>
      <div id="transmit-msg" class="muted" style="font-size:0.8rem;margin-top:6px"></div>
    </div>

    <div class="proof">
      <h4>Livraisons webhook</h4>
      ${
        (deliveries.deliveries || []).length
          ? `<pre>${esc(
              (deliveries.deliveries || [])
                .map(
                  (d) =>
                    `${d.created_at} · ${d.status}${d.http_status ? " (HTTP " + d.http_status + ")" : ""}${d.error ? " · " + d.error : ""}`
                )
                .join("\n")
            )}</pre>`
          : "<em>Aucune transmission pour le moment.</em>"
      }
    </div>

    <div class="proof">
      <h4>Preuve de consentement (RGPD)</h4>
      <button class="btn btn--primary" id="cert-btn" style="width:100%;margin-bottom:12px">
        📄 Télécharger le certificat de consentement
      </button>
      ${
        consent
          ? `<details><summary style="cursor:pointer;color:#64748b;font-size:0.8rem">Voir le détail technique</summary><pre>${esc(JSON.stringify(consent.preuve_consentement, null, 2))}</pre></details>`
          : "<em>Aucune preuve disponible.</em>"
      }
    </div>
  `;

  el("save-lead").addEventListener("click", () => saveLead(id));
  el("transmit-lead").addEventListener("click", () => transmitLead(id));
  el("cert-btn").addEventListener("click", () => {
    window.open(
      `/api/admin/leads/${id}/consent/certificate?token=${encodeURIComponent(token)}`,
      "_blank"
    );
  });
  togglePanel(true);
}

async function saveLead(id) {
  const body = {};
  document.querySelectorAll("[data-field]").forEach((n) => {
    body[n.dataset.field] = n.value;
  });
  const btn = el("save-lead");
  btn.disabled = true;
  btn.textContent = "Enregistrement...";
  await api(`/api/admin/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  btn.disabled = false;
  btn.textContent = "Enregistrer";
  togglePanel(false);
  loadStats();
  loadLeads();
}

async function transmitLead(id) {
  const btn = el("transmit-lead");
  const msg = el("transmit-msg");
  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Transmission...";
  try {
    const r = await api(`/api/admin/leads/${id}/transmettre`, { method: "POST" });
    if (r.ok) {
      msg.textContent = "Lead transmis avec succes au courtier partenaire.";
      msg.style.color = "#047857";
      loadStats();
      loadLeads();
    } else {
      const reason = r.webhook?.reason === "no_url" ? "aucune URL de webhook configuree" : r.webhook?.error || "echec";
      msg.textContent = "Echec de la transmission : " + reason;
      msg.style.color = "#b91c1c";
    }
  } catch {
    msg.textContent = "Erreur lors de la transmission.";
    msg.style.color = "#b91c1c";
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
    openPanel(id);
  }
}

function togglePanel(open) {
  el("detail-panel").hidden = !open;
  el("panel-overlay").hidden = !open;
}

// Events
el("login-btn").addEventListener("click", login);
el("token-input").addEventListener("keydown", (e) => e.key === "Enter" && login());
el("refresh-btn").addEventListener("click", () => { loadStats(); loadLeads(); });
el("export-btn").addEventListener("click", exportCsv);
el("logout-btn").addEventListener("click", logout);

async function exportCsv() {
  const statut = el("filter-statut").value;
  const q = el("search").value.trim();
  const params = new URLSearchParams();
  if (statut) params.set("statut", statut);
  if (q) params.set("q", q);
  const res = await fetch("/api/admin/leads/export.csv?" + params.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-mutuelle-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
el("filter-statut").addEventListener("change", loadLeads);
el("search").addEventListener("input", debounce(loadLeads, 300));
el("panel-close").addEventListener("click", () => togglePanel(false));
el("panel-overlay").addEventListener("click", () => togglePanel(false));

// --- Onglets / vue analytics ---------------------------------------------
document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => switchView(t.dataset.view));
});
el("analytics-days").addEventListener("change", loadAnalytics);
el("spend-form").addEventListener("submit", addSpend);
["sim-budget", "sim-cpl", "sim-taux", "sim-prix", "sim-reventes", "sim-frais"].forEach((id) => {
  const node = el(id);
  if (node) node.addEventListener("input", computeSim);
});

function switchView(view) {
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("tab--active", t.dataset.view === view)
  );
  const isAnalytics = view === "analytics";
  const isSim = view === "simulateur";
  const isLeads = view === "leads";
  el("view-analytics").hidden = !isAnalytics;
  el("view-simulateur").hidden = !isSim;
  el("leads-toolbar").hidden = !isLeads;
  el("leads-table-wrap").hidden = !isLeads;
  if (isAnalytics) loadAnalytics();
  if (isSim) computeSim();
}

function numVal(id) {
  const v = parseFloat(el(id).value);
  return Number.isFinite(v) ? v : 0;
}

function eur(n) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n)) + " €";
}

function computeSim() {
  const budget = numVal("sim-budget");
  const cpl = numVal("sim-cpl");
  const taux = numVal("sim-taux") / 100;
  const prix = numVal("sim-prix");
  const reventes = Math.max(1, numVal("sim-reventes") || 1);
  const frais = numVal("sim-frais");

  const leadsAcquis = cpl > 0 ? budget / cpl : 0;
  const leadsVendables = leadsAcquis * taux;
  const ca = leadsVendables * prix * reventes;
  const coutTotal = budget + frais;
  const benefice = ca - coutTotal;
  const marge = ca > 0 ? (benefice / ca) * 100 : 0;
  const roas = budget > 0 ? ca / budget : 0;

  const benefClass = benefice >= 0 ? "big" : "neg";
  el("sim-results").innerHTML = [
    `<div class="sim-kpi"><b>${Math.round(leadsAcquis)}</b><span>leads acquis / mois</span></div>`,
    `<div class="sim-kpi"><b>${Math.round(leadsVendables)}</b><span>leads vendables / mois</span></div>`,
    `<div class="sim-kpi big"><b>${eur(ca)}</b><span>Chiffre d'affaires / mois</span></div>`,
    `<div class="sim-kpi"><b>${eur(coutTotal)}</b><span>Coûts (pub + frais)</span></div>`,
    `<div class="sim-kpi ${benefClass}"><b>${eur(benefice)}</b><span>Bénéfice estimé / mois</span></div>`,
    `<div class="sim-kpi"><b>${marge.toFixed(0)} %</b><span>Marge nette</span></div>`,
    `<div class="sim-kpi"><b>${roas.toFixed(1)}×</b><span>Retour sur pub (ROAS)</span></div>`,
    `<div class="sim-kpi"><b>${eur(ca * 12)}</b><span>CA annualisé</span></div>`,
  ].join("");
}

function renderAggTable(container, rows) {
  const max = Math.max(1, ...rows.map((r) => r.leads));
  el(container).innerHTML = rows.length
    ? `<table><thead><tr><th>Cle</th><th class="num">Leads</th><th class="num">Convertis</th><th class="num">Taux</th></tr></thead><tbody>${rows
        .map(
          (r) =>
            `<tr><td>${esc(r.cle)}<div class="bar"><i style="width:${Math.round(
              (r.leads / max) * 100
            )}%"></i></div></td><td class="num">${r.leads}</td><td class="num">${r.convertis}</td><td class="num">${r.taux_conversion}%</td></tr>`
        )
        .join("")}</tbody></table>`
    : "<em>Aucune donnee.</em>";
}

async function loadAnalytics() {
  const days = el("analytics-days").value;
  const a = await api(`/api/admin/analytics?days=${days}`);
  const f = a.funnel;
  const pct = (n) => (f.total ? Math.round((n / f.total) * 100) : 0);
  el("funnel").innerHTML = [
    { b: f.total, s: "Leads recus", p: null },
    { b: f.contactes, s: "Contactes", p: pct(f.contactes) },
    { b: f.qualifies, s: "Qualifies", p: pct(f.qualifies) },
    { b: f.transmis, s: "Transmis", p: pct(f.transmis) },
    { b: f.perdus, s: "Perdus", p: pct(f.perdus) },
    { b: f.desinscrits, s: "Desinscrits", p: pct(f.desinscrits) },
  ]
    .map(
      (x) =>
        `<div class="fstep"><b>${x.b}</b><span>${x.s}</span>${
          x.p !== null ? `<small>${x.p}%</small>` : ""
        }</div>`
    )
    .join("");
  renderIleTable(a.parIle, a.global);
  renderAggTable("an-persona", a.parPersona);
  renderAggTable("an-source", a.parSource);
  renderAggTable("an-utm-campaign", a.parUtmCampaign);
}

function renderIleTable(rows, global) {
  const g = global || {};
  const head = `<p class="muted" style="font-size:0.82rem;margin:0 0 8px">
    Dépense totale : <b>${g.depense_eur ?? 0} €</b> ·
    CPL global : <b>${g.cpl_eur ?? 0} €</b> ·
    Clics WhatsApp : <b>${g.clics_whatsapp ?? 0}</b></p>`;
  el("an-ile").innerHTML =
    head +
    (rows && rows.length
      ? `<table><thead><tr><th>Île</th><th class="num">Leads</th><th class="num">Convertis</th><th class="num">WhatsApp</th><th class="num">Dépense</th><th class="num">CPL</th><th class="num">CPL qualifié</th></tr></thead><tbody>${rows
          .map(
            (r) =>
              `<tr><td>${esc(r.cle)}</td><td class="num">${r.leads}</td><td class="num">${r.convertis}</td><td class="num">${r.clics_whatsapp}</td><td class="num">${r.depense_eur} €</td><td class="num cpl">${r.cpl_eur} €</td><td class="num cpl">${r.cpl_qualifie_eur} €</td></tr>`
          )
          .join("")}</tbody></table>`
      : "<em>Aucune donnee.</em>");
}

async function addSpend(e) {
  e.preventDefault();
  const body = {
    jour: el("sp-jour").value,
    ile: el("sp-ile").value,
    source: el("sp-source").value,
    montant_eur: el("sp-montant").value,
  };
  const r = await api("/api/admin/spend", { method: "POST", body: JSON.stringify(body) });
  if (r.ok) {
    el("sp-montant").value = "";
    loadAnalytics();
  }
}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

if (token) showDashboard();
