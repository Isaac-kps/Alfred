import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MarkdownViewer from './components/MarkdownViewer'
import './App.css'

type Tab = 'research' | 'reports'

const TAB_CONFIG: Record<Tab, { api: string; label: string; empty: string; hint: string }> = {
  research: {
    api: '/api/research',
    label: 'Research',
    empty: 'No research reports found.',
    hint: 'Add .md files to the research/ folder and refresh.',
  },
  reports: {
    api: '/api/reports',
    label: 'Sprint Reports',
    empty: 'No sprint reports found.',
    hint: 'Run /morning-call to generate a sprint summary.',
  },
}

function App() {
  const [tab, setTab] = useState<Tab>('research')
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFiles([])
    setSelected(null)
    setContent('')
    setError(null)
    fetch(TAB_CONFIG[tab].api)
      .then(res => res.json())
      .then((data: string[]) => {
        const sorted = [...data].sort().reverse()
        setFiles(sorted)
        if (sorted.length > 0) setSelected(sorted[0])
      })
      .catch(() => setError('Could not load files.'))
  }, [tab])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    setError(null)
    fetch(`${TAB_CONFIG[tab].api}/${encodeURIComponent(selected)}`)
      .then(res => res.text())
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load file.')
        setLoading(false)
      })
  }, [selected, tab])

  const cfg = TAB_CONFIG[tab]

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">Alfred</span>
          <div className="header-rule" />
          <div className="header-tabs">
            <button
              className={`header-tab ${tab === 'research' ? 'active' : ''}`}
              onClick={() => setTab('research')}
            >
              Research
            </button>
            <button
              className={`header-tab ${tab === 'reports' ? 'active' : ''}`}
              onClick={() => setTab('reports')}
            >
              Reports
            </button>
          </div>
        </div>
        <div className="header-meta">
          <span className="header-count">{files.length} {files.length !== 1 ? 'files' : 'file'}</span>
        </div>
      </header>

      <div className="app-body">
        <Sidebar files={files} selected={selected} onSelect={setSelected} label={cfg.label} />
        <main className="main-content">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading"><span className="spinner" />Loading...</div>}
          {!loading && !error && content && (
            <MarkdownViewer content={content} filename={selected || ''} />
          )}
          {!loading && !error && !content && files.length === 0 && (
            <div className="empty-state">
              <p>{cfg.empty}</p>
              <p className="hint">{cfg.hint}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
