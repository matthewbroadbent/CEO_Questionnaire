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

const Question3: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  prevQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const options = [
    'Enhancing deal sourcing & pipeline management.',
    'Streamlining due diligence processes.',
    'Optimising portfolio company performance.',
    'Improving internal operational efficiencies (e.g., back-office).',
    'Other'
  ]

  const handleCheckboxChange = (option: string) => {
    const currentFocus = responses.initial_ai_focus || []
    const isSelected = currentFocus.includes(option)
    
    if (isSelected) {
      updateResponse('initial_ai_focus', currentFocus.filter(item => item !== option))
    } else {
      // Limit to top 2 selections
      if (currentFocus.length < 2) {
        updateResponse('initial_ai_focus', [...currentFocus, option])
      } else {
        // Replace the first selection with the new one
        updateResponse('initial_ai_focus', [currentFocus[1], option])
      }
    }
  }

  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResponse('initial_ai_focus_other', e.target.value)
  }

  const showOtherInput = (responses.initial_ai_focus || []).includes('Other')

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        If your firm has introduced AI, what was the primary focus of your initial implementation?
      </h2>
      <p style={{ color: 'var(--medium-grey)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Select top 1-2
      </p>
      
      <div className="checkbox-group">
        {options.map((option, index) => {
          const isSelected = (responses.initial_ai_focus || []).includes(option)
          const isDisabled = !isSelected && (responses.initial_ai_focus || []).length >= 2
          
          return (
            <div
              key={index}
              className={`checkbox-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && handleCheckboxChange(option)}
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
            value={responses.initial_ai_focus_other || ''}
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

      <div className="navigation">
        <button onClick={prevQuestion} className="btn btn-secondary">
          Previous
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--medium-grey)', fontSize: '0.875rem' }}>
            {currentQuestion} of {totalQuestions}
          </span>
          <button onClick={nextQuestion} className="btn btn-primary">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question3
