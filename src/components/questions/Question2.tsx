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

const Question2: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  prevQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const options = [
    'We are actively piloting and testing various AI solutions.',
    'We have successfully integrated AI into core business functions.',
    'We are still exploring the potential of AI.',
    'We have no immediate plans for AI adoption.'
  ]

  const handleCheckboxChange = (option: string) => {
    const currentApproaches = responses.ai_current_approach || []
    const isSelected = currentApproaches.includes(option)
    
    if (isSelected) {
      updateResponse('ai_current_approach', currentApproaches.filter(item => item !== option))
    } else {
      updateResponse('ai_current_approach', [...currentApproaches, option])
    }
  }

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        Which of the following best describes your firm's current approach to AI?
      </h2>
      <p style={{ color: 'var(--medium-grey)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Select all that apply
      </p>
      
      <div className="checkbox-group">
        {options.map((option, index) => {
          const isSelected = (responses.ai_current_approach || []).includes(option)
          return (
            <div
              key={index}
              className={`checkbox-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCheckboxChange(option)}
            >
              <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                {isSelected && '✓'}
              </div>
              <span>{option}</span>
            </div>
          )
        })}
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
            disabled={!responses.ai_current_approach || responses.ai_current_approach.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question2
