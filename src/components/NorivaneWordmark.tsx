import React from 'react'
import { useLocation } from 'react-router-dom'

const NorivaneWordmark: React.FC = () => {
  const location = useLocation()
  
  // Use dark blue text on white backgrounds (questionnaire and feedback pages)
  // Use white text on dark landing page
  const isLandingPage = location.pathname === '/'
  const textColor = isLandingPage ? '#FFFFFF' : '#0A2342'

  return (
    <div style={{ 
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      marginBottom: '2rem',
      color: textColor
    }}>
      nor<span style={{ 
        fontStyle: 'italic', 
        fontWeight: 400, 
        color: '#00B2A9' 
      }}>i</span>vane
    </div>
  )
}

export default NorivaneWordmark
