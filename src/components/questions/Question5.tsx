import React from 'react'
import { QuestionnaireResponse } from '../../types/questionnaire'

interface QuestionProps {
  responses: Partial<QuestionnaireResponse>
  updateResponse: (key: keyof QuestionnaireResponse, value: any) => void
  nextQuestion: () => void
  prevQuestion: () => void
  currentQuestion: number
  totalQuestions: number
}

const Question5: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  prevQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    // Limit to approximately 50 words
    const wordCount = value.trim().split(/\s+/).length
    if (wordCount <= 50 || value.length < (responses.hypothetical_impact || '').length) {
      updateResponse('hypothetical_impact', value)
    }
  }

  const wordCount = (responses.hypothetical_impact || '').trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        Imagine a proven AI strategy could reduce your deal sourcing costs by 50% AND accelerate 
        deal flow by 25% within 12 months. What would be the biggest impact on your firm?
      </h2>
      <p style={{ color: 'var(--medium-grey)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Maximum 50 words
      </p>
      
      <div style={{ position: 'relative' }}>
        <textarea
          className="text-input"
          placeholder="Share your thoughts on the potential impact..."
          value={responses.hypothetical_impact || ''}
          onChange={handleTextChange}
          style={{ paddingBottom: '2.5rem' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem',
          fontSize: '0.75rem',
          color: wordCount > 50 ? 'var(--sharp-teal)' : 'var(--medium-grey)'
        }}>
          {wordCount}/50 words
        </div>
      </div>

      <div className="navigation">
        <button onClick={prevQuestion} className="btn btn-secondary">
          Previous
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--medium-grey)', fontSize: '0.875rem' }}>
            {currentQuestion} of {totalQuestions}
          </span>
          <button 
            onClick={nextQuestion} 
            className="btn btn-primary"
            disabled={!responses.hypothetical_impact || responses.hypothetical_impact.trim().length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question5
