import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MarkdownViewer from './components/MarkdownViewer'
import './App.css'

function App() {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/research')
      .then(res => res.json())
      .then((data: string[]) => {
        setFiles(data)
        if (data.length > 0) setSelected(data[0])
      })
      .catch(() => setError('Could not load research files.'))
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    setError(null)
    fetch(`/api/research/${encodeURIComponent(selected)}`)
      .then(res => res.text())
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load file.')
        setLoading(false)
      })
  }, [selected])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">Alfred</span>
          <span className="header-divider">|</span>
          <span className="header-title">Research Library</span>
        </div>
        <span className="header-count">{files.length} report{files.length !== 1 ? 's' : ''}</span>
      </header>

      <div className="app-body">
        <Sidebar files={files} selected={selected} onSelect={setSelected} />
        <main className="main-content">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading"><span className="spinner" />Loading report...</div>}
          {!loading && !error && content && (
            <MarkdownViewer content={content} filename={selected || ''} />
          )}
          {!loading && !error && !content && files.length === 0 && (
            <div className="empty-state">
              <p>No research reports found.</p>
              <p className="hint">Add <code>.md</code> files to the <code>research/</code> folder and refresh.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
