import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

const relevamientoFile = resolve(__dirname, 'src/data/relevamiento.json')

// Persists the relevamiento form into src/data/relevamiento.json (dev + preview only)
function relevamientoApi() {
  const middleware = (req, res, next) => {
    if (req.url?.split('?')[0] !== '/api/relevamiento') return next()

    const send = (status, body) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    }
    const read = () => JSON.parse(readFileSync(relevamientoFile, 'utf8'))

    if (req.method === 'GET') return send(200, read())

    if (req.method === 'POST') {
      let raw = ''
      req.on('data', (chunk) => { raw += chunk })
      req.on('end', () => {
        try {
          const entry = JSON.parse(raw)
          if (!entry.relevado_por || !Array.isArray(entry.items) || entry.items.length === 0) {
            return send(400, { error: 'Faltan datos del relevamiento.' })
          }
          const data = read()
          data.relevamientos.push(entry)
          writeFileSync(relevamientoFile, JSON.stringify(data, null, 2) + '\n')
          send(201, entry)
        } catch (err) {
          send(500, { error: err.message })
        }
      })
      return
    }

    send(405, { error: 'Método no permitido.' })
  }

  return {
    name: 'relevamiento-api',
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { server.middlewares.use(middleware) },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    relevamientoApi(),
  ],
  server: {
    // Avoid a full reload every time a relevamiento is saved
    watch: { ignored: [relevamientoFile] },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        eje: resolve(__dirname, 'eje.html'),
        objetivo: resolve(__dirname, 'objetivo.html'),
        relevamiento: resolve(__dirname, 'relevamiento.html'),
        resultados: resolve(__dirname, 'resultados.html'),
      },
    },
  },
})
