import { useEffect, useState } from 'react'
import { getRecommendation } from '../utils/api'
import type { OrgDetails, RecommendationResponse, FormatType } from '../types'

interface Props {
  orgDetails: OrgDetails
  initialRecommendation?: RecommendationResponse
  initialFormat?: FormatType
  onSubmit: (format: FormatType, rec: RecommendationResponse) => void
  onBack: () => void
}

interface FormatCard {
  id: FormatType
  icon: string
  label: string
  description: string
}

const FORMAT_CARDS: FormatCard[] = [
  {
    id: 'quiz',
    icon: '🎯',
    label: 'Quiz',
    description: 'Scored questions that categorise or score your audience and deliver personalised insights.',
  },
  {
    id: 'self-assessment',
    icon: '🪞',
    label: 'Self-Assessment',
    description: 'Reflective questions that help your audience rate their current position or readiness.',
  },
  {
    id: 'checklist',
    icon: '✅',
    label: 'Checklist',
    description: 'Actionable items your audience works through at their own pace, tracking real progress.',
  },
  {
    id: 'audit',
    icon: '🔍',
    label: 'Audit',
    description: 'A structured review of current practices against a benchmark or best-practice framework.',
  },
]

export function StepTwo({
  orgDetails,
  initialRecommendation,
  initialFormat,
  onSubmit,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(!initialRecommendation)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(
    initialRecommendation ?? null
  )
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(
    initialFormat ?? initialRecommendation?.format ?? null
  )

  useEffect(() => {
    if (initialRecommendation) return
    let cancelled = false

    async function fetchRec() {
      setLoading(true)
      setError(null)
      try {
        const rec = await getRecommendation(orgDetails)
        if (!cancelled) {
          setRecommendation(rec)
          setSelectedFormat(rec.format)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRec()
    return () => { cancelled = true }
  }, [orgDetails, initialRecommendation, retryCount])

  function handleConfirm() {
    if (!selectedFormat || !recommendation) return
    onSubmit(selectedFormat, recommendation)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-light-green border-t-transparent animate-spin" />
        <p className="text-dark-green/60 font-medium text-sm">Analysing your organisation...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-dark-green mb-2">Something went wrong</h2>
        <p className="text-dark-green/60 text-sm mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border-2 border-dark-green/20 text-dark-green/60 text-sm font-semibold hover:border-dark-green/40 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-5 py-2.5 rounded-lg bg-light-green text-white text-sm font-semibold hover:bg-dark-green transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-green mb-2">Choose your lead gen format</h1>
        <p className="text-dark-green/60 text-sm">
          Our AI has recommended a format based on your organisation. Confirm or choose a different one.
        </p>
      </div>

      {recommendation && (
        <div className="bg-dark-green rounded-2xl p-5 mb-6 flex gap-4 items-start">
          <div className="text-2xl mt-0.5">🥑</div>
          <div>
            <p className="text-cream/70 text-xs font-semibold uppercase tracking-widest mb-1">
              AI Recommendation
            </p>
            <p className="text-cream font-medium text-sm leading-relaxed">{recommendation.reason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {FORMAT_CARDS.map((card) => {
          const isRecommended = card.id === recommendation?.format
          const isSelected = card.id === selectedFormat
          return (
            <button
              key={card.id}
              onClick={() => setSelectedFormat(card.id)}
              className={[
                'text-left rounded-xl p-4 border-2 transition-all duration-200 relative',
                isSelected
                  ? 'border-light-green bg-white shadow-card-hover'
                  : 'border-dark-green/10 bg-white hover:border-light-green/50 hover:shadow-card',
              ].join(' ')}
            >
              {isRecommended && (
                <span className="absolute top-3 right-3 text-xs font-bold text-light-green bg-light-green/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="font-bold text-dark-green mb-1">{card.label}</div>
              <div className="text-xs text-dark-green/60 leading-relaxed">{card.description}</div>
              {isSelected && (
                <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-light-green flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-dark-green/50 hover:text-dark-green text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedFormat}
          className="bg-light-green hover:bg-dark-green disabled:bg-dark-green/20 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          Build My Tool
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
