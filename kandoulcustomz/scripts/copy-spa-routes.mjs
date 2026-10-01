import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')
const indexPath = path.join(dist, 'index.html')

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

const indexHtml = fs.readFileSync(indexPath)

// Real HTML files for each SPA route so GitHub Pages never serves a blank 404 body
const routes = [
  'shop',
  'custom-order',
  'about',
  'faq',
  'contact',
  'payment-methods',
  'thank-you',
]

for (const route of routes) {
  const dir = path.join(dist, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml)
  console.log(`copied index.html → ${route}/index.html`)
}
