import { useEffect, useRef, useState } from 'react'
import molstarScriptUrl from 'molstar/build/viewer/molstar.js?url'
import molstarCssUrl from 'molstar/build/viewer/molstar.css?url'

// The Mol* UMD bundle is huge and doesn't survive Vite's dep optimizer cleanly,
// so we load the prebuilt browser bundle as a static asset and use the global it
// installs on `window`. This is the path Mol*'s own embed examples use.

type MolstarViewerInstance = {
  loadPdb: (pdb: string) => Promise<void>
  dispose: () => void
}

type MolstarGlobal = {
  Viewer: {
    create: (
      el: HTMLElement,
      opts?: Record<string, unknown>,
    ) => Promise<MolstarViewerInstance>
  }
}

declare global {
  interface Window {
    molstar?: MolstarGlobal
  }
}

let loaderPromise: Promise<MolstarGlobal> | null = null

function loadMolstar(): Promise<MolstarGlobal> {
  if (typeof window !== 'undefined' && window.molstar?.Viewer) {
    return Promise.resolve(window.molstar)
  }
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise<MolstarGlobal>((resolve, reject) => {
    if (!document.querySelector(`link[data-molstar="css"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = molstarCssUrl
      link.dataset.molstar = 'css'
      document.head.appendChild(link)
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-molstar="js"]`,
    )
    const script = existing ?? document.createElement('script')
    if (!existing) {
      script.src = molstarScriptUrl
      script.async = true
      script.dataset.molstar = 'js'
      document.head.appendChild(script)
    }

    const onReady = () => {
      if (window.molstar?.Viewer) resolve(window.molstar)
      else reject(new Error('Mol* loaded but window.molstar is missing'))
    }

    if ((script as HTMLScriptElement & { _loaded?: boolean })._loaded) {
      onReady()
    } else {
      script.addEventListener('load', () => {
        ;(script as HTMLScriptElement & { _loaded?: boolean })._loaded = true
        onReady()
      })
      script.addEventListener('error', () =>
        reject(new Error('Failed to load Mol* viewer bundle')),
      )
    }
  })

  return loaderPromise
}

type Props = { id: string }

export default function MolstarViewer({ id }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<MolstarViewerInstance | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    loadMolstar()
      .then((mol) =>
        mol.Viewer.create(container, {
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          collapseLeftPanel: true,
          collapseRightPanel: true,
          viewportShowExpand: true,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false,
          viewportShowControls: true,
          viewportShowSettings: false,
          viewportShowScreenshotControls: true,
          viewportShowToggleFullscreen: true,
          viewportBackgroundColor: '#0a0a0b',
          pdbProvider: 'rcsb',
        }),
      )
      .then((viewer) => {
        if (cancelled) {
          viewer.dispose()
          return
        }
        viewerRef.current = viewer
        setReady(true)
      })
      .catch((err) => {
        console.error('Mol* failed to initialize:', err)
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to start 3D engine',
          )
        }
      })

    return () => {
      cancelled = true
      viewerRef.current?.dispose()
      viewerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready || !viewerRef.current) return
    setError(null)
    viewerRef.current.loadPdb(id).catch((err) => {
      console.error(`Mol* failed to load ${id}:`, err)
      setError(err instanceof Error ? err.message : `Failed to load ${id}`)
    })
  }, [id, ready])

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-zinc-950/80 backdrop-blur-sm">
          <div className="max-w-sm text-center text-sm text-red-300 px-4">
            <p className="font-medium mb-1">Mol* error</p>
            <p className="text-xs text-red-300/80 break-words">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
