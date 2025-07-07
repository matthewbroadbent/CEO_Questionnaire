import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { QuestionnaireResponse, FeedbackData, BenchmarkData } from '../types/questionnaire'

export const generatePDFReport = async (
  responses: QuestionnaireResponse,
  feedback: FeedbackData,
  benchmark: BenchmarkData,
  readinessScore: number
): Promise<string> => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20

  // Norivane brand colors
  const darkBlue = '#0A2342'
  const teal = '#00B2A9'

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6): number => {
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + (lines.length * lineHeight)
  }

  // Page 1: Executive Summary
  pdf.setFillColor(10, 35, 66) // Dark blue
  pdf.rect(0, 0, pageWidth, 40, 'F')

  // Header
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('NORIVANE', margin, 25)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('AI Strategy Assessment Report', margin, 32)

  // Reset text color
  pdf.setTextColor(0, 0, 0)

  // Executive Summary Section
  let currentY = 60
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Executive Summary', margin, currentY)
  currentY += 15

  // Readiness Score Box
  pdf.setFillColor(0, 178, 169) // Teal
  pdf.rect(margin, currentY, pageWidth - (margin * 2), 25, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('AI Readiness Score', margin + 10, currentY + 10)
  
  pdf.setFontSize(24)
  pdf.text(`${readinessScore}/100`, margin + 10, currentY + 20)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(feedback.title, pageWidth - margin - 60, currentY + 15)

  currentY += 35
  pdf.setTextColor(0, 0, 0)

  // Personal Message
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  currentY = addWrappedText(
    `Dear ${responses.first_name || 'CEO'},\n\n${feedback.body}`,
    margin,
    currentY,
    pageWidth - (margin * 2)
  )

  currentY += 15

  // Key Metrics Section
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Your Assessment Results', margin, currentY)
  currentY += 10

  const metrics = [
    `AI Importance Rating: ${responses.ai_importance_rating}/5 (Industry Average: ${benchmark.averageImportanceRating}/5)`,
    `AI Strategy Status: ${responses.has_ai_strategy}`,
    `Implementation Confidence: ${responses.future_strategy_confidence}/5 (Industry Average: ${benchmark.averageConfidence}/5)`,
    `Primary Focus Areas: ${responses.initial_ai_focus?.join(', ') || 'Not specified'}`
  ]

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  metrics.forEach(metric => {
    currentY = addWrappedText(`• ${metric}`, margin + 5, currentY, pageWidth - (margin * 2) - 5)
    currentY += 2
  })

  // Page 2: Detailed Analysis
  pdf.addPage()
  currentY = margin

  // Header
  pdf.setFillColor(10, 35, 66)
  pdf.rect(0, 0, pageWidth, 30, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Detailed Analysis & Recommendations', margin, 20)

  currentY = 50
  pdf.setTextColor(0, 0, 0)

  // Benchmark Comparison
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Industry Benchmark Comparison', margin, currentY)
  currentY += 10

  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  currentY = addWrappedText(
    `Based on responses from ${benchmark.totalResponses} VC/PE leaders, your firm demonstrates ${
      readinessScore >= 60 ? 'strong' : readinessScore >= 40 ? 'moderate' : 'emerging'
    } AI readiness compared to industry peers.`,
    margin,
    currentY,
    pageWidth - (margin * 2)
  )

  currentY += 10

  // Strategy Distribution
  const strategyText = `Industry AI Strategy Distribution:
• Have Strategy: ${benchmark.strategyDistribution.yes}%
• Partially Developed: ${benchmark.strategyDistribution.partially}%
• No Strategy: ${benchmark.strategyDistribution.no}%

Your Status: ${responses.has_ai_strategy}`

  currentY = addWrappedText(strategyText, margin, currentY, pageWidth - (margin * 2))
  currentY += 15

  // Recommendations
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Personalized Recommendations', margin, currentY)
  currentY += 10

  const getRecommendations = (level: string): string[] => {
    switch (level) {
      case 'high':
        return [
          'Optimize existing AI implementations for maximum ROI through advanced analytics',
          'Explore cutting-edge AI applications in portfolio management and risk assessment',
          'Develop AI-driven competitive intelligence capabilities for market advantage'
        ]
      case 'moderate':
        return [
          'Develop a comprehensive AI strategy roadmap with clear milestones',
          'Prioritize high-impact AI use cases in deal sourcing and due diligence',
          'Build internal AI capabilities through training and strategic partnerships'
        ]
      default:
        return [
          'Conduct comprehensive AI opportunity assessment across your deal flow',
          'Start with pilot AI projects in due diligence automation and screening',
          'Build foundational data infrastructure to enable future AI implementations'
        ]
    }
  }

  const recommendations = getRecommendations(feedback.aiReadinessLevel)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)

  recommendations.forEach((rec, index) => {
    currentY = addWrappedText(`${index + 1}. ${rec}`, margin, currentY, pageWidth - (margin * 2))
    currentY += 5
  })

  currentY += 10

  // ROI Potential
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ROI Potential', margin, currentY)
  currentY += 10

  const roiText = readinessScore >= 70 
    ? 'High optimization potential: 40-60% efficiency gains through advanced AI implementation'
    : readinessScore >= 50
    ? 'Significant opportunity: 25-40% cost reduction potential through strategic AI adoption'
    : readinessScore >= 30
    ? 'Substantial improvement: 30-50% enhancement in deal sourcing efficiency'
    : 'Transformational potential: 50%+ cost reduction and 25%+ deal flow acceleration possible'

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  currentY = addWrappedText(roiText, margin, currentY, pageWidth - (margin * 2))

  // Footer with CTA
  currentY = pageHeight - 60
  pdf.setFillColor(0, 178, 169)
  pdf.rect(margin, currentY, pageWidth - (margin * 2), 40, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Ready to Unlock Your AI Potential?', margin + 10, currentY + 15)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text('Book a consultation with Matthew Broadbent:', margin + 10, currentY + 25)
  pdf.text('https://calendly.com/matthew-norivane/quick-call', margin + 10, currentY + 32)

  // Generate PDF as base64 string
  return pdf.output('datauristring')
}
