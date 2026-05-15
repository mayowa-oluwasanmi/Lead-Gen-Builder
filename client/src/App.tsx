import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { ProgressBar } from './components/ProgressBar'
import { StepOne } from './components/StepOne'
import { StepTwo } from './components/StepTwo'
import { StepThree } from './components/StepThree'
import type { OrgDetails, RecommendationResponse, GeneratedTool, FormatType } from './types'

export default function App() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [orgDetails, setOrgDetails] = useState<OrgDetails | null>(null)
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(null)
  const [generatedTool, setGeneratedTool] = useState<GeneratedTool | null>(null)

  function handleStep1Submit(details: OrgDetails) {
    setOrgDetails(details)
    setRecommendation(null)
    setSelectedFormat(null)
    setGeneratedTool(null)
    setCurrentStep(2)
  }

  function handleStep2Submit(format: FormatType, rec: RecommendationResponse) {
    setSelectedFormat(format)
    setRecommendation(rec)
    setGeneratedTool(null)
    setCurrentStep(3)
  }

  function handleBack2to1() {
    setCurrentStep(1)
  }

  function handleBack3to2() {
    setGeneratedTool(null)
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen bg-cream font-barlow">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} />
        {currentStep === 1 && (
          <StepOne onSubmit={handleStep1Submit} initialValues={orgDetails ?? undefined} />
        )}
        {currentStep === 2 && orgDetails && (
          <StepTwo
            orgDetails={orgDetails}
            initialRecommendation={recommendation ?? undefined}
            initialFormat={selectedFormat ?? undefined}
            onSubmit={handleStep2Submit}
            onBack={handleBack2to1}
          />
        )}
        {currentStep === 3 && orgDetails && selectedFormat && (
          <StepThree
            orgDetails={orgDetails}
            selectedFormat={selectedFormat}
            generatedTool={generatedTool}
            setGeneratedTool={setGeneratedTool}
            onBack={handleBack3to2}
          />
        )}
      </main>
    </div>
  )
}
