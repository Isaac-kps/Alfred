interface SidebarProps {
  files: string[]
  selected: string | null
  onSelect: (file: string) => void
}

function formatTitle(filename: string): string {
  return filename
    .replace('.md', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Sidebar({ files, selected, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">Reports</div>
      <nav className="sidebar-nav">
        {files.length === 0 && (
          <p className="sidebar-empty">No reports yet.</p>
        )}
        {files.map(file => (
          <button
            key={file}
            className={`sidebar-item ${selected === file ? 'active' : ''}`}
            onClick={() => onSelect(file)}
            title={file}
          >
            <span className="sidebar-icon">📄</span>
            <span className="sidebar-name">{formatTitle(file)}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
