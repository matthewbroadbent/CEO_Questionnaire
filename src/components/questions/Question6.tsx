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

const Question6: React.FC<QuestionProps> = ({ 
  responses, 
  updateResponse, 
  nextQuestion, 
  prevQuestion, 
  currentQuestion, 
  totalQuestions 
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateResponse('future_strategy_confidence', parseInt(e.target.value))
  }

  return (
    <div className="question-card fade-in">
      <h2 className="question-title">
        Given the rapid pace of AI innovation, how confident are you that your firm's current 
        AI strategy (or lack thereof) is fully optimised for future growth and competitive advantage?
      </h2>
      
      <div className="slider-container">
        <input
          type="range"
          min="1"
          max="5"
          value={responses.future_strategy_confidence || 3}
          onChange={handleSliderChange}
          className="slider"
          style={{
            background: `linear-gradient(to right, var(--sharp-teal) 0%, var(--sharp-teal) ${((responses.future_strategy_confidence || 3) - 1) * 25}%, #e9ecef ${((responses.future_strategy_confidence || 3) - 1) * 25}%, #e9ecef 100%)`
          }}
        />
        <div className="slider-labels">
          <span>Not confident</span>
          <span>Highly confident</span>
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
          <button onClick={nextQuestion} className="btn btn-primary">
            Complete Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default Question6
