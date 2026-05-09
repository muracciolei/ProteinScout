import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDebounce } from '../hooks/useDebounce'
import { getProteinMany, searchProteins } from '../services/rcsb'
import type { ProteinSummary } from '../types/protein'
import { ProteinCard } from './ProteinCard'

type Props = {
  selectedId: string | null
  onSelect: (id: string) => void
}

type SearchState = {
  query: string // the query whose results are stored here ('' = none yet)
  items: ProteinSummary[]
  total: number
  error: string | null
}

const SUGGESTIONS = ['hemoglobin', 'CRISPR', 'spike protein', 'insulin', 'p53']

const INITIAL: SearchState = { query: '', items: [], total: 0, error: null }

export function ProteinSearch({ selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('hemoglobin')
  const debounced = useDebounce(query, 350)
  const trimmed = debounced.trim()
  const [state, setState] = useState<SearchState>(INITIAL)

  useEffect(() => {
    if (!trimmed) return
    const ctrl = new AbortController()

    searchProteins(trimmed, 24, ctrl.signal)
      .then(({ ids, total }) => {
        if (ids.length === 0) {
          setState({ query: trimmed, items: [], total, error: null })
          return
        }
        return getProteinMany(ids, ctrl.signal).then((items) => {
          setState({ query: trimmed, items, total, error: null })
        })
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setState({
          query: trimmed,
          items: [],
          total: 0,
          error: err instanceof Error ? err.message : 'Search failed',
        })
      })

    return () => ctrl.abort()
  }, [trimmed])

  // Auto-select first result when results refresh and current selection is no longer in the list.
  // Watching only items identity/length avoids re-running on every selection change.
  const firstId = state.items[0]?.id
  useEffect(() => {
    if (state.items.length === 0) return
    if (!selectedId || !state.items.some((i) => i.id === selectedId)) {
      onSelect(state.items[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items.length, firstId])

  const items = trimmed === '' ? [] : state.items
  const loading =
    trimmed !== '' && state.query !== trimmed && state.error === null
  const showEmpty =
    !loading && items.length === 0 && trimmed !== '' && state.query === trimmed

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-zinc-800/80">
        <label className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-2">
          Search the Protein Data Bank
        </label>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. hemoglobin, 1A3N, CRISPR…"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/70 focus:ring-1 focus:ring-fuchsia-500/40"
          />
          {loading && (
            <span
              aria-hidden
              className="absolute right-3 top-1/2 -translate-y-1/2 size-3 rounded-full border-2 border-fuchsia-500/40 border-t-fuchsia-400 animate-spin"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {state.error && (
          <p className="text-sm text-red-400 px-2">{state.error}</p>
        )}
        {showEmpty && <p className="text-sm text-zinc-500 px-2">No matches.</p>}
        {items.length > 0 && (
          <p className="text-[11px] text-zinc-500 px-2 pb-1">
            {items.length} of {state.total.toLocaleString()} entries
          </p>
        )}
        <AnimatePresence initial={false}>
          {items.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ProteinCard
                protein={p}
                selected={selectedId === p.id}
                onSelect={onSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
