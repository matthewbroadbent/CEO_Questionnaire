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

const Question1: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResponse('ai_importance_rating', parseInt(e.target.value))
  }

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        How critical is Artificial Intelligence to your firm's strategic agenda today?
      </h2>
      
      <div className="slider-container">
        <input
          type="range"
          min="1"
          max="5"
          value={responses.ai_importance_rating || 3}
          onChange={handleSliderChange}
          className="slider"
          style={{
            background: `linear-gradient(to right, var(--sharp-teal) 0%, var(--sharp-teal) ${((responses.ai_importance_rating || 3) - 1) * 25}%, #e9ecef ${((responses.ai_importance_rating || 3) - 1) * 25}%, #e9ecef 100%)`
          }}
        />
        <div className="slider-labels">
          <span>Not on our radar</span>
          <span>A fixed board agenda item, like ESG</span>
        </div>
      </div>

      <div className="navigation">
        <div></div>
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

export default Question1
