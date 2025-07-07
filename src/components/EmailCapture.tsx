import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { QuestionnaireResponse } from '../types/questionnaire'

interface EmailCaptureProps {
  responses: Partial<QuestionnaireResponse>
  onSubmit: (email: string, firstName: string) => void
  isSubmitting: boolean
}

const EmailCapture: React.FC<EmailCaptureProps> = ({ responses, onSubmit, isSubmitting }) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [errors, setErrors] = useState<{ email?: string; firstName?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; firstName?: string } = {}
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(email.trim(), firstName.trim())
    }
  }

  return (
    <motion.div
      className="question-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="question-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
          Get Your Personalized AI Strategy Report
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#6c757d', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          Receive your personalized AI readiness assessment and see how your responses compare 
          to other VC/PE leaders in our exclusive benchmark report.
        </p>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #0A2342 0%, #0d2d4a 100%)', 
          color: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            📊 Your Report Will Include:
          </h3>
          <ul style={{ 
            textAlign: 'left', 
            listStyle: 'none', 
            padding: 0,
            fontSize: '1rem',
            lineHeight: '1.8'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✓ Your AI Strategy Readiness Score</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Personalized recommendations for your firm</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Benchmark comparison with 500+ VC/PE leaders</li>
            <li style={{ marginBottom: '0.5rem' }}>✓ Industry trends and best practices</li>
            <li>✓ Priority action items for immediate impact</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label 
              htmlFor="firstName" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#212529'
              }}
            >
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-input"
              style={{ 
                minHeight: 'auto', 
                padding: '1rem',
                borderColor: errors.firstName ? '#dc3545' : '#e9ecef'
              }}
              placeholder="Enter your first name"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#212529'
              }}
            >
              Business Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              style={{ 
                minHeight: 'auto', 
                padding: '1rem',
                borderColor: errors.email ? '#dc3545' : '#e9ecef'
              }}
              placeholder="Enter your business email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ 
              fontSize: '1.125rem', 
              padding: '1rem 2.5rem',
              minWidth: '200px',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Generating Report...' : 'Get My AI Strategy Report'}
          </button>
          
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6c757d', 
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            Your report will be delivered instantly. We respect your privacy and will never share your information.
          </p>
        </div>
      </form>
    </motion.div>
  )
}

export default EmailCapture
