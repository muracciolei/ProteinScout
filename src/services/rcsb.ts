import type { ProteinSummary, SearchResult } from '../types/protein'

const SEARCH_URL = 'https://search.rcsb.org/rcsbsearch/v2/query'
const ENTRY_URL = 'https://data.rcsb.org/rest/v1/core/entry'

const PDB_ID = /^[0-9][A-Za-z0-9]{3}$/

export async function searchProteins(
  query: string,
  rows = 24,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const trimmed = query.trim()
  if (!trimmed) return { ids: [], total: 0 }

  const body = PDB_ID.test(trimmed)
    ? {
        query: {
          type: 'terminal',
          service: 'text',
          parameters: {
            attribute: 'rcsb_entry_container_identifiers.entry_id',
            operator: 'exact_match',
            value: trimmed.toUpperCase(),
          },
        },
        return_type: 'entry',
        request_options: { paginate: { start: 0, rows } },
      }
    : {
        query: {
          type: 'terminal',
          service: 'full_text',
          parameters: { value: trimmed },
        },
        return_type: 'entry',
        request_options: {
          paginate: { start: 0, rows },
          scoring_strategy: 'combined',
          sort: [{ sort_by: 'score', direction: 'desc' }],
        },
      }

  const res = await fetch(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  // RCSB returns 204 No Content for empty result sets.
  if (res.status === 204) return { ids: [], total: 0 }
  if (!res.ok) throw new Error(`Search failed (${res.status})`)

  const data: { result_set?: Array<{ identifier: string }>; total_count?: number } =
    await res.json()
  const ids = (data.result_set ?? []).map((r) => r.identifier)
  return { ids, total: data.total_count ?? ids.length }
}

type RcsbEntry = {
  rcsb_id?: string
  struct?: { title?: string }
  struct_keywords?: { pdbx_keywords?: string }
  rcsb_entry_info?: {
    resolution_combined?: number[]
    experimental_method?: string
  }
  rcsb_accession_info?: { initial_release_date?: string }
  rcsb_entity_source_organism?: Array<{ ncbi_scientific_name?: string }>
  // Top-level entity organism is not on entry; available via polymer_entity. Keep optional.
}

export async function getProtein(
  id: string,
  signal?: AbortSignal,
): Promise<ProteinSummary> {
  const res = await fetch(`${ENTRY_URL}/${id.toUpperCase()}`, { signal })
  if (!res.ok) throw new Error(`Entry ${id} not found (${res.status})`)
  const e: RcsbEntry = await res.json()
  return {
    id: (e.rcsb_id ?? id).toUpperCase(),
    title: e.struct?.title?.trim() || 'Untitled structure',
    keywords: e.struct_keywords?.pdbx_keywords,
    method: e.rcsb_entry_info?.experimental_method,
    resolution: e.rcsb_entry_info?.resolution_combined?.[0],
    releasedOn: e.rcsb_accession_info?.initial_release_date?.slice(0, 10),
  }
}

export function getProteinMany(
  ids: string[],
  signal?: AbortSignal,
): Promise<ProteinSummary[]> {
  return Promise.all(
    ids.map((id) =>
      getProtein(id, signal).catch(
        (): ProteinSummary => ({ id, title: 'Unavailable' }),
      ),
    ),
  )
}

export const rcsbEntryUrl = (id: string) =>
  `https://www.rcsb.org/structure/${id.toUpperCase()}`

export const molstarEmbedUrl = (id: string) =>
  `https://molstar.org/viewer/?pdb=${id.toUpperCase()}&hide-controls=0`
