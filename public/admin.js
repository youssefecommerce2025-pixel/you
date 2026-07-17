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
      const profil = [l.tranche_age, l.situation, l.budget_mensuel ? l.budget_mensuel + "€" : null]
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
      <label>Tranche d'age</label>
      ${optSel("tranche_age", lead.tranche_age, [
        { v: "", t: "—" },
        { v: "18-34", t: "18-34" },
        { v: "35-54", t: "35-54" },
        { v: "55-64", t: "55-64" },
        { v: "65-74", t: "65-74" },
        { v: "75+", t: "75+" },
      ])}
    </div>

    <div class="grp">
      <label>Situation</label>
      ${optSel("situation", lead.situation, [
        { v: "", t: "—" },
        { v: "actif", t: "Actif" },
        { v: "independant", t: "Independant / TNS" },
        { v: "retraite", t: "Retraite" },
        { v: "sans_emploi", t: "Sans emploi" },
      ])}
    </div>

    <div class="grp">
      <label>Mutuelle actuelle</label>
      ${optSel("mutuelle_actuelle", lead.mutuelle_actuelle, [
        { v: "", t: "—" },
        { v: "oui", t: "Oui" },
        { v: "non", t: "Non" },
      ])}
    </div>

    <div class="grp">
      <label>Budget mensuel</label>
      ${optSel("budget_mensuel", lead.budget_mensuel, [
        { v: "", t: "—" },
        { v: "0-30", t: "< 30€" },
        { v: "30-60", t: "30-60€" },
        { v: "60-100", t: "60-100€" },
        { v: "100+", t: "100€+" },
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

    <div class="proof">
      <h4>Preuve de consentement (RGPD)</h4>
      ${
        consent
          ? `<pre>${esc(JSON.stringify(consent.preuve_consentement, null, 2))}</pre>`
          : "<em>Aucune preuve disponible.</em>"
      }
    </div>
  `;

  el("save-lead").addEventListener("click", () => saveLead(id));
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

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

if (token) showDashboard();
