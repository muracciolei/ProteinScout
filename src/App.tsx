import { useState } from 'react'
import { ProteinSearch } from './components/ProteinSearch'
import { ProteinViewer } from './components/ProteinViewer'

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="h-dvh flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <header className="shrink-0 flex items-center justify-between gap-4 px-5 py-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 shadow-[0_0_12px_rgba(217,70,239,0.6)]"
          />
          <h1 className="text-base font-semibold tracking-tight">
            Protein Scout
          </h1>
          <span className="text-xs text-zinc-500 hidden sm:inline truncate">
            · explore the universe of proteins
          </span>
        </div>
        <a
          href="https://buymeacoffee.com/muracciolei"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-amber-400/90 hover:bg-amber-300 text-black font-medium"
        >
          ☕ Support
        </a>
      </header>

      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        <aside className="shrink-0 md:w-[clamp(280px,28vw,380px)] max-h-[45dvh] md:max-h-none md:h-auto border-b md:border-b-0 md:border-r border-zinc-800/80 min-h-0 flex flex-col">
          <ProteinSearch selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
        <section className="flex-1 min-w-0 min-h-0">
          <ProteinViewer id={selectedId} />
        </section>
      </main>
    </div>
  )
}

export default App
