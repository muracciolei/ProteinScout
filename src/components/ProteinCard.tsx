import { motion } from 'framer-motion'
import type { ProteinSummary } from '../types/protein'

type Props = {
  protein: ProteinSummary
  selected: boolean
  onSelect: (id: string) => void
}

export function ProteinCard({ protein, selected, onSelect }: Props) {
  return (
    <motion.button
      layout
      onClick={() => onSelect(protein.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={[
        'group text-left w-full rounded-lg p-3 border transition-colors',
        selected
          ? 'border-fuchsia-500/70 bg-fuchsia-500/10'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm text-fuchsia-300">{protein.id}</span>
        {protein.resolution !== undefined && (
          <span className="text-[11px] text-zinc-500">
            {protein.resolution.toFixed(2)} Å
          </span>
        )}
      </div>
      <h3 className="mt-1 text-sm text-zinc-200 line-clamp-2">{protein.title}</h3>
      {(protein.keywords || protein.method) && (
        <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-500 line-clamp-1">
          {[protein.keywords, protein.method].filter(Boolean).join(' · ')}
        </p>
      )}
    </motion.button>
  )
}
