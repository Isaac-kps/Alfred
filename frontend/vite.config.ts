import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function makeMdPlugin(name: string, dir: string, mountPath: string) {
  return {
    name,
    configureServer(server: any) {
      server.middlewares.use(mountPath, (req: any, res: any) => {
        const baseDir = path.resolve(__dirname, dir)
        const url = (req.url || '/').split('?')[0]

        if (url === '/' || url === '') {
          const files = fs.existsSync(baseDir)
            ? fs.readdirSync(baseDir).filter((f: string) => f.endsWith('.md'))
            : []
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(files))
        } else {
          const filename = decodeURIComponent(url.slice(1))
          const filePath = path.resolve(baseDir, filename)
          if (
            filePath.startsWith(baseDir) &&
            fs.existsSync(filePath) &&
            filename.endsWith('.md')
          ) {
            const content = fs.readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(content)
          } else {
            res.statusCode = 404
            res.end('Not found')
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    makeMdPlugin('research-plugin', '../research', '/api/research'),
    makeMdPlugin('reports-plugin', '../report/sprint-summary', '/api/reports'),
  ],
  server: {
    port: 3003,
  },
})
