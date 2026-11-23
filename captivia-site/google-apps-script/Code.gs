/**
 * Captivia — réception des diagnostics.
 *
 * 1. Créez un Google Sheet vide nommé « Diagnostics Captivia ».
 * 2. Extensions → Apps Script, remplacez le code par ce fichier, enregistrez.
 * 3. Paramètres du projet (engrenage) → Propriétés du script :
 *      CALLMEBOT_APIKEY = la clé reçue sur WhatsApp
 *      OWNER_PHONE = +212772234117
 * 4. Déployer → Nouveau déploiement → Application Web
 *      Exécuter en tant que : Moi
 *      Qui a accès : Tout le monde
 * 5. Copiez l’URL qui se termine par /exec dans public/leads-config.js
 *
 * WhatsApp (une seule fois, sur votre téléphone) :
 *    Ajoutez +34 644 45 70 57, envoyez : I allow callmebot to send me messages
 *    Le bot répond avec votre clé. Collez-la dans CALLMEBOT_APIKEY.
 */

var COLUMNS = [
  ['date', 'Date (Casablanca)'],
  ['prenom', 'Prénom'],
  ['nom', 'Nom'],
  ['marque', 'Marque'],
  ['telephone', 'Téléphone'],
  ['email', 'E-mail'],
  ['langue', 'Langue du site'],
  ['offre', 'Offre recommandée'],
  ['compatibilite', 'Compatibilité'],
  ['alternative', 'Offre alternative'],
  ['univers', 'Univers'],
  ['canal', 'Où vend la marque'],
  ['catalogue', 'Nombre de produits'],
  ['commandes', 'Commandes par mois'],
  ['frustration', 'Frustration'],
  ['fonctions', 'Fonctions souhaitées'],
  ['budget', 'Budget'],
  ['delai', 'Délai'],
  ['commentaire', 'Commentaire'],
  ['maquette', 'Maquette atelier'],
  ['offre_regardee', 'Offre regardée avant le diagnostic'],
]

function doGet() {
  return ContentService.createTextOutput('Captivia diagnostics OK')
}

function doPost(e) {
  try {
    var data = JSON.parse((e.postData && e.postData.contents) || '{}')
    if (data.source !== 'captivia-diagnostic') {
      return json_({ ok: false, error: 'source' })
    }
    appendLead_(data)
    var whatsapp = notifyWhatsApp_(data)
    return json_({ ok: true, whatsapp: whatsapp })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function appendLead_(data) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('Diagnostics')
  if (!sheet) sheet = SpreadsheetApp.getActive().insertSheet('Diagnostics')
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (col) { return col[1] }))
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold')
  }
  sheet.appendRow(COLUMNS.map(function (col) { return data[col[0]] || '' }))
}

function notifyWhatsApp_(data) {
  var props = PropertiesService.getScriptProperties()
  var apiKey = props.getProperty('CALLMEBOT_APIKEY')
  var phone = props.getProperty('OWNER_PHONE') || '+212772234117'
  if (!apiKey) return 'clé WhatsApp absente'
  var lines = [
    '*Nouveau diagnostic Captivia*',
    '',
    'Un prospect vient de terminer son diagnostic sur captivia.online.',
    '',
    '*Marque :* ' + (data.marque || '—'),
    '*Contact :* ' + [data.prenom, data.nom].filter(Boolean).join(' '),
    '*WhatsApp :* ' + (data.telephone || '—'),
    '*E-mail :* ' + (data.email || '—'),
    '*Langue du site :* ' + (data.langue || '—'),
    '',
    '*Offre recommandée :* ' + (data.offre || '—') + ' (' + (data.compatibilite || '—') + ')',
    '*À regarder aussi :* ' + (data.alternative || '—'),
    '',
    '*Réponses*',
    '• Univers : ' + (data.univers || '—'),
    '• Vente actuelle : ' + (data.canal || '—'),
    '• Produits : ' + (data.catalogue || '—'),
    '• Commandes / mois : ' + (data.commandes || '—'),
    '• Frustration : ' + (data.frustration || '—'),
    '• Souhaits : ' + (data.fonctions || '—'),
    '• Budget : ' + (data.budget || '—'),
    '• Mise en ligne : ' + (data.delai || '—'),
  ]
  if (data.commentaire) lines.push('• Commentaire : ' + data.commentaire)
  if (data.maquette) lines.push('• Maquette : ' + data.maquette)
  if (data.offre_regardee) lines.push('• Offre ouverte avant le diagnostic : ' + data.offre_regardee)
  lines.push('')
  lines.push('La ligne est ajoutée dans l’onglet Diagnostics du Google Sheet.')
  var text = lines.join('\n')

  var url = 'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(phone) +
    '&text=' + encodeURIComponent(text) +
    '&apikey=' + encodeURIComponent(apiKey)
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true })
  return response.getResponseCode() + ' ' + response.getContentText().slice(0, 180)
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)
}
