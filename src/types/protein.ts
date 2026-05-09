export type ProteinSummary = {
  id: string
  title: string
  keywords?: string
  organism?: string
  method?: string
  resolution?: number
  releasedOn?: string
}

export type SearchResult = {
  ids: string[]
  total: number
}
