import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import NorivaneWordmark from './NorivaneWordmark'

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NorivaneWordmark />
            <h1 className="hero-title">
              Unlock Exponential Growth: Your Firm's AI Advantage
            </h1>
            <p className="hero-subtitle">
              In just 3 minutes, discover how intelligent AI can halve deal sourcing costs, 
              accelerate deal flow by 25%+, and boost portfolio ROI.
            </p>
            <p className="hero-description">
              The AI landscape is rapidly evolving. We're surveying top-tier VC & PE leaders 
              to understand current trends and identify opportunities for truly transformative 
              AI implementation that aligns with your strategic goals.
            </p>
            <Link to="/questionnaire" className="btn btn-primary">
              Start My AI Impact Assessment
            </Link>
          </motion.div>
        </div>
      </header>
    </div>
  )
}

export default LandingPage
