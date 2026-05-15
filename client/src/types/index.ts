export type FormatType = 'quiz' | 'self-assessment' | 'checklist' | 'audit'

export interface OrgDetails {
  orgName: string
  mission: string
  vision: string
  activities: string
  audience: string
}

export interface RecommendationResponse {
  format: FormatType
  reason: string
}

export interface Question {
  question: string
  options: string[]
}

export interface ChecklistItem {
  title: string
  detail: string
}

export interface GeneratedTool {
  title: string
  description: string
  questions?: Question[]
  items?: ChecklistItem[]
  emailGateTitle: string
  emailGateCopy: string
  ctaText: string
  socialPost: string
  emailSubject: string
  hashtags: string[]
}
