import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QuestionnaireResponse, FeedbackData, BenchmarkData } from '../types/questionnaire'
import NorivaneWordmark from './NorivaneWordmark'

const FeedbackPage: React.FC = () => {
  const location = useLocation()
  const responses = location.state?.responses as QuestionnaireResponse
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null)

  useEffect(() => {
    if (responses) {
      setFeedback(generateFeedback(responses))
      setBenchmark(generateBenchmarkData(responses))
    }
  }, [responses])

  const generateFeedback = (responses: QuestionnaireResponse): FeedbackData => {
    const aiImportance = responses.ai_importance_rating
    const hasStrategy = responses.has_ai_strategy
    const currentApproach = responses.ai_current_approach || []
    const confidence = responses.future_strategy_confidence

    // Determine AI readiness level
    let aiReadinessLevel: 'high' | 'moderate' | 'low' = 'low'
    
    if (aiImportance >= 4 && (hasStrategy === 'Yes' || currentApproach.includes('We have successfully integrated AI into core business functions.'))) {
      aiReadinessLevel = 'high'
    } else if (aiImportance >= 3 && (hasStrategy === 'Partially' || currentApproach.includes('We are actively piloting and testing various AI solutions.'))) {
      aiReadinessLevel = 'moderate'
    }

    // Generate personalised feedback
    switch (aiReadinessLevel) {
      case 'high':
        return {
          title: 'AI Strategic Leader',
          subtitle: 'Your firm demonstrates strong AI strategic focus and implementation.',
          body: `Hi ${responses.first_name || 'there'}! Your responses indicate a strong strategic focus on AI. Many leaders like you are now seeking to optimise existing implementations for even greater competitive edge. Our data shows firms at your stage often unlock significant further value by refining their AI roadmap and exploring advanced applications in deal sourcing and portfolio management.`,
          aiReadinessLevel: 'high'
        }
      
      case 'moderate':
        return {
          title: 'AI Explorer with Potential',
          subtitle: 'Your firm is actively exploring AI with clear opportunities for acceleration.',
          body: `Hi ${responses.first_name || 'there'}! It's clear AI is on your firm's radar, and you're actively exploring its capabilities. Many leading VC/PE firms at this stage find tremendous benefit in developing a focused, integrated AI strategy to move beyond testing to measurable ROI across deal sourcing, due diligence, and portfolio management.`,
          aiReadinessLevel: 'moderate'
        }
      
      default:
        return {
          title: 'Untapped AI Opportunity',
          subtitle: 'Your firm has significant potential to gain competitive advantage through strategic AI adoption.',
          body: `Hi ${responses.first_name || 'there'}! The world of VC/PE is being reshaped by AI, with firms achieving significant efficiencies and ROI. Your firm has a unique opportunity to gain a substantial competitive advantage by strategically integrating AI. Understanding where to start and how to prioritise is key to realising these benefits.`,
          aiReadinessLevel: 'low'
        }
    }
  }

  const generateBenchmarkData = (responses: QuestionnaireResponse): BenchmarkData => {
    // Simulated benchmark data - in production, this would come from actual database aggregations
    return {
      totalResponses: 547,
      averageImportanceRating: 3.8,
      strategyDistribution: {
        yes: 23,
        no: 41,
        partially: 36
      },
      topFocusAreas: [
        { area: 'Deal sourcing and screening', percentage: 67 },
        { area: 'Due diligence automation', percentage: 54 },
        { area: 'Portfolio company performance monitoring', percentage: 48 },
        { area: 'Market research and analysis', percentage: 42 },
        { area: 'Risk assessment and management', percentage: 38 }
      ],
      averageConfidence: 3.2
    }
  }

  const getReadinessScore = (responses: QuestionnaireResponse): number => {
    let score = 0
    
    // AI importance (0-20 points)
    score += (responses.ai_importance_rating - 1) * 5
    
    // Current approach (0-25 points)
    const approachScores: { [key: string]: number } = {
      'We have successfully integrated AI into core business functions.': 25,
      'We are actively piloting and testing various AI solutions.': 20,
      'We are researching AI applications but haven\'t implemented anything yet.': 10,
      'We are aware of AI but haven\'t taken any concrete steps.': 5,
      'AI is not currently on our radar.': 0
    }
    const maxApproachScore = Math.max(...(responses.ai_current_approach || []).map(approach => approachScores[approach] || 0))
    score += maxApproachScore
    
    // Strategy (0-20 points)
    const strategyScores = { 'Yes': 20, 'Partially': 10, 'No': 0 }
    score += strategyScores[responses.has_ai_strategy]
    
    // Confidence (0-20 points)
    score += (responses.future_strategy_confidence - 1) * 5
    
    // Focus areas (0-15 points)
    score += Math.min((responses.initial_ai_focus?.length || 0) * 3, 15)
    
    return Math.round(score)
  }

  if (!feedback || !benchmark) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <NorivaneWordmark />
        <p>Generating your personalised feedback...</p>
      </div>
    )
  }

  const readinessScore = getReadinessScore(responses)

  return (
    <div className="feedback-page">
      <header style={{ padding: '2rem 0', backgroundColor: 'white', borderBottom: '1px solid #e9ecef' }}>
        <div className="container">
          <NorivaneWordmark />
        </div>
      </header>

      <main className="feedback-section">
        <div className="container">
          <motion.div
            className="feedback-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="feedback-title">Your AI Strategy Report</h1>
            <h2 className="feedback-subtitle">{feedback.subtitle}</h2>
            
            {/* Readiness Score */}
            <div style={{ 
              background: 'linear-gradient(135deg, #0A2342 0%, #0d2d4a 100%)', 
              color: 'white', 
              padding: '2rem', 
              borderRadius: '16px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your AI Readiness Score</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#00B2A9', marginBottom: '0.5rem' }}>
                {readinessScore}/100
              </div>
              <p style={{ opacity: 0.9 }}>
                {readinessScore >= 70 ? 'Excellent - You\'re ahead of the curve' :
                 readinessScore >= 50 ? 'Good - Strong foundation with room to grow' :
                 readinessScore >= 30 ? 'Developing - Clear opportunities for improvement' :
                 'Early Stage - Significant potential for competitive advantage'}
              </p>
            </div>

            <p className="feedback-body">{feedback.body}</p>

            {/* Benchmark Comparison */}
            <div style={{ 
              background: '#f8f9fa', 
              padding: '2rem', 
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0A2342' }}>
                📊 How You Compare to {benchmark.totalResponses} VC/PE Leaders
              </h3>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>AI Importance Rating:</span>
                  <span style={{ fontWeight: '600' }}>
                    You: {responses.ai_importance_rating}/5 | Average: {benchmark.averageImportanceRating}/5
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Strategy Confidence:</span>
                  <span style={{ fontWeight: '600' }}>
                    You: {responses.future_strategy_confidence}/5 | Average: {benchmark.averageConfidence}/5
                  </span>
                </div>
                
                <div>
                  <p style={{ marginBottom: '1rem', fontWeight: '600' }}>AI Strategy Status Distribution:</p>
                  <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Have Strategy: {benchmark.strategyDistribution.yes}%</div>
                    <div>Partially: {benchmark.strategyDistribution.partially}%</div>
                    <div>No Strategy: {benchmark.strategyDistribution.no}%</div>
                    <div style={{ fontWeight: '600', color: '#00B2A9' }}>
                      You: {responses.has_ai_strategy}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p style={{ marginBottom: '1rem', fontWeight: '600' }}>Top AI Focus Areas:</p>
                  <div style={{ fontSize: '0.9rem' }}>
                    {benchmark.topFocusAreas.slice(0, 3).map((area, index) => (
                      <div key={index} style={{ marginBottom: '0.25rem' }}>
                        {index + 1}. {area.area} ({area.percentage}%)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h3 className="cta-title">Ready to Unlock Your Firm's Full AI Potential?</h3>
              <p className="cta-body">
                Matthew Broadbent, a Deloitte Chartered Accountant specialising in intelligent AI 
                implementation, is ready to discuss how Norivane can help your firm leverage 
                intelligent AI to halve deal sourcing costs, accelerate deal flow by 25%+, 
                and increase ROI across your portfolio.
              </p>
              <a 
                href="https://calendly.com/matthew-norivane/quick-call" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}
              >
                Book a Quick Call with Matthew Broadbent
              </a>
              <a 
                href="https://calendly.com/matthew-norivane/quick-call" 
                target="_blank" 
                rel="noopener noreferrer"
                className="calendly-link"
              >
                https://calendly.com/matthew-norivane/quick-call
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default FeedbackPage
