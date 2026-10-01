import { timingSafeEqual, randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

export const PREVIEW_COOKIE = 'jsl_preview'
export const PREVIEW_ACCESS_FILE = new URL('./.preview-access.json', import.meta.url)

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function readPreviewAccess(file = PREVIEW_ACCESS_FILE) {
  const path = file instanceof URL ? file : file
  if (!existsSync(path)) return null
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'))
    if (!data?.password || !data?.token || !data?.expiresAt) return null
    return data
  } catch {
    return null
  }
}

export function createPreviewAccess({ password, expiresAt, file = PREVIEW_ACCESS_FILE }) {
  const access = {
    password,
    token: randomBytes(32).toString('hex'),
    expiresAt,
  }
  writeFileSync(file, JSON.stringify(access, null, 2))
  return access
}

function cookieValue(req) {
  const raw = req.headers.cookie || ''
  for (const part of raw.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === PREVIEW_COOKIE) return decodeURIComponent(rest.join('='))
  }
  return ''
}

function page({ title, body }) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0a0a0a; color: #fff; font-family: Georgia, "Times New Roman", serif; }
    main { width: min(420px, calc(100% - 32px)); }
    p, label { font-family: system-ui, sans-serif; }
    h1 { font-size: 2rem; font-weight: 700; margin: 0 0 8px; }
    .muted { color: rgba(255,255,255,.62); line-height: 1.5; margin: 0 0 24px; }
    label { display: block; font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 8px; color: #e8c97a; }
    input { width: 100%; box-sizing: border-box; border: 1px solid rgba(255,255,255,.16); background: #141414; color: #fff; border-radius: 999px; padding: 14px 18px; font-size: 1rem; }
    button { margin-top: 16px; width: 100%; border: 0; border-radius: 999px; padding: 14px 18px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; background: linear-gradient(135deg, #c9a84c, #e8c97a); color: #111; cursor: pointer; }
    .error { color: #ffb4b4; font-family: system-ui, sans-serif; margin: 0 0 16px; }
  </style>
</head>
<body><main>${body}</main></body>
</html>`
}

export function previewGateMiddleware(req, res, next, { access, now = Date.now() } = {}) {
  const gate = access === undefined ? readPreviewAccess() : access
  if (!gate) return next()

  const expired = now >= gate.expiresAt
  if (expired) {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(page({
      title: 'Aperçu expiré',
      body: `<h1>Ce lien a expiré.</h1><p class="muted">L’aperçu Je suis là n’est plus disponible. Demandez un nouveau lien.</p>`,
    }))
    return
  }

  if (req.method === 'POST' && (req.url || '').split('?')[0] === '/__preview/login') {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const params = new URLSearchParams(Buffer.concat(chunks).toString())
      const nextUrl = params.get('next') || '/'
      const safeNext = nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : '/'
      if (!safeEqual(params.get('password') || '', gate.password)) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(loginPage(gate, safeNext, true))
        return
      }
      const maxAge = Math.max(1, Math.floor((gate.expiresAt - now) / 1000))
      res.statusCode = 303
      res.setHeader('Set-Cookie', `${PREVIEW_COOKIE}=${encodeURIComponent(gate.token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`)
      res.setHeader('Location', safeNext)
      res.end()
    })
    return
  }

  if (safeEqual(cookieValue(req), gate.token)) return next()

  const nextUrl = req.url && req.url.startsWith('/') ? req.url : '/'
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(loginPage(gate, nextUrl, false))
}

function loginPage(gate, nextUrl, invalid) {
  const until = new Date(gate.expiresAt).toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
  })
  return page({
    title: 'Aperçu privé',
    body: `<h1>Aperçu privé</h1>
      <p class="muted">Ce site est protégé par un mot de passe. Le lien reste ouvert jusqu’à ${until} (heure de Paris).</p>
      ${invalid ? '<p class="error">Mot de passe incorrect.</p>' : ''}
      <form method="post" action="/__preview/login">
        <input type="hidden" name="next" value="${nextUrl.replace(/"/g, '&quot;')}" />
        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required />
        <button type="submit">Entrer</button>
      </form>`,
  })
}

export function previewGatePlugin() {
  return {
    name: 'jsl-preview-gate',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        previewGateMiddleware(req, res, next)
      })
    },
  }
}
