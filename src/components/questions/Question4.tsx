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

const Question4: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  prevQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const options: Array<'Yes' | 'No' | 'Partially'> = ['Yes', 'No', 'Partially']
  
  const followUpOptions = [
    'Driven by executive leadership vision.',
    'Based on identified pain points and efficiency gains.',
    'Influenced by competitive landscape and industry trends.',
    'Guided by external expert recommendations.',
    'Other'
  ]

  const handleStrategyChange = (option: 'Yes' | 'No' | 'Partially') => {
    updateResponse('has_ai_strategy', option)
    // Clear follow-up responses if changing to No
    if (option === 'No') {
      updateResponse('strategy_prioritisation', [])
      updateResponse('strategy_prioritisation_other', '')
    }
  }

  const handleFollowUpChange = (option: string) => {
    const currentPrioritisation = responses.strategy_prioritisation || []
    const isSelected = currentPrioritisation.includes(option)
    
    if (isSelected) {
      updateResponse('strategy_prioritisation', currentPrioritisation.filter(item => item !== option))
    } else {
      // Limit to top 2 selections
      if (currentPrioritisation.length < 2) {
        updateResponse('strategy_prioritisation', [...currentPrioritisation, option])
      } else {
        updateResponse('strategy_prioritisation', [currentPrioritisation[1], option])
      }
    }
  }

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResponse('strategy_prioritisation_other', e.target.value)
  }

  const showFollowUp = responses.has_ai_strategy === 'Yes' || responses.has_ai_strategy === 'Partially'
  const showOtherInput = (responses.strategy_prioritisation || []).includes('Other')

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        Does your firm currently have a defined, documented AI strategy or roadmap?
      </h2>
      
      <div className="radio-group">
        {options.map((option) => (
          <div
            key={option}
            className={`radio-item ${responses.has_ai_strategy === option ? 'selected' : ''}`}
            onClick={() => handleStrategyChange(option)}
          >
            <div className={`radio ${responses.has_ai_strategy === option ? 'selected' : ''}`} />
            <span>{option}</span>
          </div>
        ))}
      </div>

      {showFollowUp && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: 'var(--very-dark-grey)'
          }}>
            How was this strategy primarily prioritised?
          </h3>
          <p style={{ color: 'var(--medium-grey)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Select top 1-2
          </p>
          
          <div className="checkbox-group">
            {followUpOptions.map((option, index) => {
              const isSelected = (responses.strategy_prioritisation || []).includes(option)
              const isDisabled = !isSelected && (responses.strategy_prioritisation || []).length >= 2
              
              return (
                <div
                  key={index}
                  className={`checkbox-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => !isDisabled && handleFollowUpChange(option)}
                  style={{ 
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                    {isSelected && '✓'}
                  </div>
                  <span>{option}</span>
                </div>
              )
            })}
          </div>

          {showOtherInput && (
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Please specify..."
                value={responses.strategy_prioritisation_other || ''}
                onChange={handleOtherTextChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-family)',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}
        </div>
      )}

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
            disabled={!responses.has_ai_strategy}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question4
