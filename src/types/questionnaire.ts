export interface QuestionnaireResponse {
  id?: string
  timestamp?: string
  ai_importance_rating: number
  ai_current_approach: string[]
  initial_ai_focus: string[]
  initial_ai_focus_other?: string
  has_ai_strategy: 'Yes' | 'No' | 'Partially'
  strategy_prioritisation?: string[]
  strategy_prioritisation_other?: string
  hypothetical_impact: string
  future_strategy_confidence: number
  ip_address?: string
  email?: string
  first_name?: string
}

export interface FeedbackData {
  title: string
  subtitle: string
  body: string
  aiReadinessLevel: 'high' | 'moderate' | 'low'
}

export interface BenchmarkData {
  totalResponses: number
  averageImportanceRating: number
  strategyDistribution: {
    yes: number
    no: number
    partially: number
  }
  topFocusAreas: Array<{
    area: string
    percentage: number
  }>
  averageConfidence: number
}
