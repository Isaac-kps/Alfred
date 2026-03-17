import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function researchPlugin() {
  return {
    name: 'research-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/research', (req: any, res: any) => {
        const researchDir = path.resolve(__dirname, '../research')
        const url = (req.url || '/').split('?')[0]

        if (url === '/' || url === '') {
          const files = fs.existsSync(researchDir)
            ? fs.readdirSync(researchDir).filter((f: string) => f.endsWith('.md'))
            : []
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(files))
        } else {
          const filename = decodeURIComponent(url.slice(1))
          const filePath = path.resolve(researchDir, filename)
          if (
            filePath.startsWith(researchDir) &&
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
  plugins: [react(), researchPlugin()],
  server: {
    port: 3003,
  },
})
