// Envoi des messages de confirmation (double opt-in) par email et/ou SMS.
//
// Conception "pluggable" avec repli sans configuration :
//  - EMAIL : via SMTP (nodemailer) si SMTP_HOST est defini, sinon repli fichier/console.
//  - SMS   : via HTTP POST vers un fournisseur (SMS_API_URL) si defini, sinon repli.
//  - Chaque envoi est trace dans la table outbound_messages (preuve/suivi).

import nodemailer from "nodemailer";
import { appendFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import db from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || join(__dirname, "..", "data");
mkdirSync(DATA_DIR, { recursive: true });
const OUTBOX_LOG = join(DATA_DIR, "outbox.log");

const nowIso = () => new Date().toISOString();

// --- Configuration email (SMTP) -------------------------------------------
let mailTransport = null;
if (process.env.SMTP_HOST) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "1",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}
const MAIL_FROM = process.env.MAIL_FROM || "no-reply@example.fr";

function logRow({ lead_id, channel, to, subject, body, status, error }) {
  try {
    db.prepare(
      `INSERT INTO outbound_messages (lead_id, channel, recipient, subject, body, status, error, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(lead_id ?? null, channel, to, subject ?? null, body, status, error ?? null, nowIso());
  } catch (e) {
    // table peut ne pas exister au tout premier lancement : on ignore silencieusement
  }
}

function fallbackWrite(entry) {
  const line = `[${nowIso()}] ${JSON.stringify(entry)}\n`;
  try {
    appendFileSync(OUTBOX_LOG, line);
  } catch {}
  console.log(`[notifier:fallback] ${entry.channel} -> ${entry.to}`);
}

export async function sendEmail({ to, subject, text, html, lead_id }) {
  if (!mailTransport) {
    fallbackWrite({ channel: "email", to, subject, text });
    logRow({ lead_id, channel: "email", to, subject, body: text, status: "fallback" });
    return { ok: true, mode: "fallback" };
  }
  try {
    await mailTransport.sendMail({ from: MAIL_FROM, to, subject, text, html });
    logRow({ lead_id, channel: "email", to, subject, body: text, status: "sent" });
    return { ok: true, mode: "smtp" };
  } catch (error) {
    logRow({
      lead_id,
      channel: "email",
      to,
      subject,
      body: text,
      status: "error",
      error: String(error?.message || error),
    });
    return { ok: false, error: String(error?.message || error) };
  }
}

export async function sendSms({ to, text, lead_id }) {
  const url = process.env.SMS_API_URL;
  if (!url) {
    fallbackWrite({ channel: "sms", to, text });
    logRow({ lead_id, channel: "sms", to, body: text, status: "fallback" });
    return { ok: true, mode: "fallback" };
  }
  try {
    // Format generique ; adapte le payload a ton fournisseur (Twilio, OVH, Vonage...).
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SMS_API_KEY
          ? { Authorization: `Bearer ${process.env.SMS_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        to,
        from: process.env.SMS_SENDER || "Mutuelle",
        message: text,
      }),
    });
    const status = res.ok ? "sent" : "error";
    logRow({
      lead_id,
      channel: "sms",
      to,
      body: text,
      status,
      error: res.ok ? null : `HTTP ${res.status}`,
    });
    return { ok: res.ok, mode: "http" };
  } catch (error) {
    logRow({
      lead_id,
      channel: "sms",
      to,
      body: text,
      status: "error",
      error: String(error?.message || error),
    });
    return { ok: false, error: String(error?.message || error) };
  }
}

// Envoi du lien de confirmation double opt-in (email + SMS si telephone fourni).
export async function sendDoubleOptinConfirmation({ lead, confirmUrl }) {
  const results = {};
  const subject = "Confirmez votre demande de devis mutuelle sante";
  const text =
    `Bonjour ${lead.prenom},\n\n` +
    `Pour finaliser votre demande de devis mutuelle sante et etre recontacte(e) par un conseiller, ` +
    `merci de confirmer en cliquant sur ce lien :\n${confirmUrl}\n\n` +
    `Si vous n'etes pas a l'origine de cette demande, ignorez ce message.`;
  const html =
    `<p>Bonjour ${lead.prenom},</p>` +
    `<p>Pour finaliser votre demande de devis mutuelle sante et etre recontacte(e) par un conseiller, ` +
    `merci de confirmer en cliquant sur ce lien :</p>` +
    `<p><a href="${confirmUrl}">Confirmer ma demande</a></p>` +
    `<p style="color:#64748b;font-size:12px">Si vous n'etes pas a l'origine de cette demande, ignorez ce message.</p>`;

  if (lead.email) {
    results.email = await sendEmail({ to: lead.email, subject, text, html, lead_id: lead.id });
  }
  if (lead.telephone) {
    const sms =
      `Mutuelle sante : confirmez votre demande de devis ici ${confirmUrl} ` +
      `(ignorez si ce n'est pas vous).`;
    results.sms = await sendSms({ to: lead.telephone, text: sms, lead_id: lead.id });
  }
  return results;
}

export function mailerMode() {
  return {
    email: mailTransport ? "smtp" : "fallback",
    sms: process.env.SMS_API_URL ? "http" : "fallback",
  };
}
