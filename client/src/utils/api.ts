import type { OrgDetails, RecommendationResponse, GeneratedTool, FormatType } from '../types'

async function apiFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({ error: 'Invalid server response' }))

  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `Server error ${response.status}`)
  }

  return data as T
}

export async function getRecommendation(orgDetails: OrgDetails): Promise<RecommendationResponse> {
  return apiFetch<RecommendationResponse>('/api/recommend', orgDetails)
}

export async function generateTool(
  orgDetails: OrgDetails,
  format: FormatType
): Promise<GeneratedTool> {
  return apiFetch<GeneratedTool>('/api/generate', { ...orgDetails, format })
}
