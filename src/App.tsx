import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Questionnaire from './components/Questionnaire'
import FeedbackPage from './components/FeedbackPage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </div>
  )
}

export default App
