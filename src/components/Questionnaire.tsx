import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { QuestionnaireResponse } from '../types/questionnaire'
import NorivaneWordmark from './NorivaneWordmark'
import EmailCapture from './EmailCapture'
import Question1 from './questions/Question1'
import Question2 from './questions/Question2'
import Question3 from './questions/Question3'
import Question4 from './questions/Question4'
import Question5 from './questions/Question5'
import Question6 from './questions/Question6'

const Questionnaire: React.FC = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [responses, setResponses] = useState<Partial<QuestionnaireResponse>>({
    ai_importance_rating: 3,
    ai_current_approach: [],
    initial_ai_focus: [],
    has_ai_strategy: 'No',
    strategy_prioritisation: [],
    hypothetical_impact: '',
    future_strategy_confidence: 3
  })

  const totalQuestions = 6
  const progress = showEmailCapture ? 100 : (currentQuestion / totalQuestions) * 85 // Reserve 15% for email capture

  const updateResponse = (key: keyof QuestionnaireResponse, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowEmailCapture(true)
    }
  }

  const prevQuestion = () => {
    if (showEmailCapture) {
      setShowEmailCapture(false)
    } else if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleEmailSubmit = async (email: string, firstName: string) => {
    setIsSubmitting(true)
    
    try {
      const finalResponse: QuestionnaireResponse = {
        ...responses as QuestionnaireResponse,
        email,
        first_name: firstName,
        timestamp: new Date().toISOString(),
        ip_address: await getClientIP()
      }

      const { error } = await supabase
        .from('ceo_ai_responses')
        .insert([finalResponse])

      if (error) {
        console.error('Error submitting responses:', error)
      }

      // Navigate to feedback page with responses
      navigate('/feedback', { state: { responses: finalResponse } })
    } catch (error) {
      console.error('Error submitting responses:', error)
      // Still navigate to feedback page even if submission fails
      navigate('/feedback', { state: { responses: { ...responses, email, first_name: firstName } } })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  const renderQuestion = () => {
    const questionProps = {
      responses,
      updateResponse,
      nextQuestion,
      prevQuestion,
      currentQuestion,
      totalQuestions
    }

    switch (currentQuestion) {
      case 1:
        return <Question1 {...questionProps} />
      case 2:
        return <Question2 {...questionProps} />
      case 3:
        return <Question3 {...questionProps} />
      case 4:
        return <Question4 {...questionProps} />
      case 5:
        return <Question5 {...questionProps} />
      case 6:
        return <Question6 {...questionProps} />
      default:
        return <Question1 {...questionProps} />
    }
  }

  return (
    <div className="questionnaire">
      <header style={{ padding: '2rem 0', backgroundColor: 'white', borderBottom: '1px solid #e9ecef' }}>
        <div className="container">
          <NorivaneWordmark />
        </div>
      </header>

      <main style={{ padding: '2rem 0', minHeight: '80vh' }}>
        <div className="container">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {showEmailCapture ? (
              <motion.div
                key="email-capture"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <EmailCapture 
                  responses={responses}
                  onSubmit={handleEmailSubmit}
                  isSubmitting={isSubmitting}
                />
                
                <div className="navigation">
                  <button 
                    onClick={prevQuestion}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.5 : 1 }}
                  >
                    ← Back
                  </button>
                  <div></div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {renderQuestion()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Questionnaire
