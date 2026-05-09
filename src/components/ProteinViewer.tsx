import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProtein, rcsbEntryUrl } from '../services/rcsb'
import type { ProteinSummary } from '../types/protein'

const MolstarViewer = lazy(() => import('./MolstarViewer'))

type Props = { id: string | null }

export function ProteinViewer({ id }: Props) {
  const [details, setDetails] = useState<ProteinSummary | null>(null)

  useEffect(() => {
    if (!id) return
    const ctrl = new AbortController()
    getProtein(id, ctrl.signal)
      .then((d) => setDetails(d))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        // Keep previous details visible rather than blanking on transient failures.
      })
    return () => ctrl.abort()
  }, [id])

  if (!id) {
    return (
      <div className="h-full grid place-items-center text-zinc-500 text-sm">
        Pick a protein to load its 3D structure.
      </div>
    )
  }

  const upperId = id.toUpperCase()
  const loading = details?.id !== upperId

  return (
    <div className="h-full flex flex-col min-h-0">
      <header className="shrink-0 p-4 border-b border-zinc-800/80 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-fuchsia-300 text-sm">{upperId}</span>
            {loading && (
              <span
                aria-hidden
                className="size-3 rounded-full border-2 border-fuchsia-500/40 border-t-fuchsia-400 animate-spin"
              />
            )}
          </div>
          <h2 className="text-lg font-medium text-zinc-100 truncate">
            {loading ? '…' : details!.title}
          </h2>
          {!loading && details && (
            <p className="text-[11px] text-zinc-500 mt-1">
              {[
                details.method,
                details.resolution !== undefined &&
                  `${details.resolution.toFixed(2)} Å`,
                details.releasedOn && `Released ${details.releasedOn}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
        <a
          href={rcsbEntryUrl(upperId)}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-fuchsia-300"
        >
          RCSB ↗
        </a>
      </header>
      <motion.div
        key={upperId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex-1 min-h-0 bg-black"
      >
        <Suspense
          fallback={
            <div className="h-full grid place-items-center text-zinc-500 text-xs">
              Loading 3D engine…
            </div>
          }
        >
          <MolstarViewer id={upperId} />
        </Suspense>
      </motion.div>
    </div>
  )
}
