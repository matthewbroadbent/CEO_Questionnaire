import emailjs from '@emailjs/browser'
import { QuestionnaireResponse, FeedbackData, BenchmarkData } from '../types/questionnaire'

// EmailJS configuration
const SERVICE_ID = 'service_m0qgr6d'
const TEMPLATE_ID = 'template_2w1xycv'
const PUBLIC_KEY = 'sSDnT1cA_qkR3BmGF'

// Initialize EmailJS
emailjs.init(PUBLIC_KEY)

export interface EmailTemplateParams {
  to_email: string
  to_name: string
  company_name: string
  ceo_title: string
  readiness_score: number
  readiness_level: string
  readiness_summary: string
  ai_importance_rating: number
  strategy_status: string
  confidence_level: number
  focus_areas: string
  benchmark_importance: number
  benchmark_confidence: number
  peer_comparison: string
  key_recommendations: string
  next_steps: string
  roi_potential: string
  calendly_link: string
  report_date: string
  pdf_attachment?: string
}

export const generateEmailParams = (
  responses: QuestionnaireResponse,
  feedback: FeedbackData,
  benchmark: BenchmarkData,
  readinessScore: number
): EmailTemplateParams => {
  const focusAreas = responses.initial_ai_focus?.join(', ') || 'Not specified'
  
  // Generate personalized recommendations based on readiness level
  const getRecommendations = (level: string): string => {
    switch (level) {
      case 'high':
        return `1. Optimize existing AI implementations for maximum ROI
2. Explore advanced AI applications in portfolio management
3. Develop AI-driven competitive intelligence capabilities`
      case 'moderate':
        return `1. Develop a comprehensive AI strategy roadmap
2. Prioritize high-impact AI use cases in deal sourcing
3. Build internal AI capabilities and partnerships`
      default:
        return `1. Conduct AI opportunity assessment across your deal flow
2. Start with pilot AI projects in due diligence automation
3. Build foundational data infrastructure for AI readiness`
    }
  }

  const getNextSteps = (level: string): string => {
    switch (level) {
      case 'high':
        return 'Schedule a strategic AI optimization review to identify advanced opportunities and maximize your existing investments.'
      case 'moderate':
        return 'Book a consultation to develop your integrated AI strategy and accelerate your current initiatives.'
      default:
        return 'Arrange an AI readiness assessment to identify quick wins and build your strategic foundation.'
    }
  }

  const getRoiPotential = (score: number): string => {
    if (score >= 70) return 'High - 40-60% efficiency gains possible through optimization'
    if (score >= 50) return 'Significant - 25-40% cost reduction potential'
    if (score >= 30) return 'Substantial - 30-50% improvement in deal sourcing efficiency'
    return 'Transformational - 50%+ cost reduction and 25%+ deal flow acceleration possible'
  }

  const getPeerComparison = (responses: QuestionnaireResponse, benchmark: BenchmarkData): string => {
    const importanceVsAvg = responses.ai_importance_rating >= benchmark.averageImportanceRating ? 'above' : 'below'
    const confidenceVsAvg = responses.future_strategy_confidence >= benchmark.averageConfidence ? 'higher' : 'lower'
    
    return `Your AI importance rating is ${importanceVsAvg} industry average, with ${confidenceVsAvg} implementation confidence than peers.`
  }

  return {
    to_email: responses.email || '',
    to_name: responses.first_name || 'there',
    company_name: 'Your Firm', // Could be enhanced to capture company name
    ceo_title: 'CEO', // Could be enhanced to capture title
    readiness_score: readinessScore,
    readiness_level: feedback.title,
    readiness_summary: feedback.subtitle,
    ai_importance_rating: responses.ai_importance_rating,
    strategy_status: responses.has_ai_strategy,
    confidence_level: responses.future_strategy_confidence,
    focus_areas: focusAreas,
    benchmark_importance: benchmark.averageImportanceRating,
    benchmark_confidence: benchmark.averageConfidence,
    peer_comparison: getPeerComparison(responses, benchmark),
    key_recommendations: getRecommendations(feedback.aiReadinessLevel),
    next_steps: getNextSteps(feedback.aiReadinessLevel),
    roi_potential: getRoiPotential(readinessScore),
    calendly_link: 'https://calendly.com/matthew-norivane/quick-call',
    report_date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
}

export const sendEmailWithResults = async (templateParams: EmailTemplateParams): Promise<boolean> => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    
    console.log('Email sent successfully:', response.status, response.text)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
