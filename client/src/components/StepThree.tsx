import { useEffect, useState } from 'react'
import { generateTool } from '../utils/api'
import { ToolPreview } from './ToolPreview'
import { EditPanel } from './EditPanel'
import { ExportPanel } from './ExportPanel'
import type { OrgDetails, GeneratedTool, FormatType } from '../types'

interface Props {
  orgDetails: OrgDetails
  selectedFormat: FormatType
  generatedTool: GeneratedTool | null
  setGeneratedTool: (tool: GeneratedTool | null) => void
  onBack: () => void
}

const FORMAT_LABELS: Record<FormatType, string> = {
  quiz: 'Quiz',
  'self-assessment': 'Self-Assessment',
  checklist: 'Checklist',
  audit: 'Audit',
}

export function StepThree({
  orgDetails,
  selectedFormat,
  generatedTool,
  setGeneratedTool,
  onBack,
}: Props) {
  const [loading, setLoading] = useState(!generatedTool)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (generatedTool) return
    let cancelled = false

    async function fetchTool() {
      setLoading(true)
      setError(null)
      try {
        const tool = await generateTool(orgDetails, selectedFormat)
        if (!cancelled) {
          setGeneratedTool(tool)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTool()
    return () => { cancelled = true }
  }, [orgDetails, selectedFormat, generatedTool, setGeneratedTool])

  function handleRetry() {
    setGeneratedTool(null)
    setError(null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-light-green border-t-transparent animate-spin" />
        <div className="text-center">
          <p className="text-dark-green font-semibold">Building your lead gen tool...</p>
          <p className="text-dark-green/50 text-sm mt-1">
            Creating a bespoke {FORMAT_LABELS[selectedFormat].toLowerCase()} for {orgDetails.orgName}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-dark-green mb-2">Generation failed</h2>
        <p className="text-dark-green/60 text-sm mb-6 max-w-sm mx-auto">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border-2 border-dark-green/20 text-dark-green/60 text-sm font-semibold hover:border-dark-green/40 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 rounded-lg bg-light-green text-white text-sm font-semibold hover:bg-dark-green transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!generatedTool) return null

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-light-green/10 text-light-green text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {FORMAT_LABELS[selectedFormat]} ready
          </div>
          <h1 className="text-2xl font-bold text-dark-green">{generatedTool.title}</h1>
          <p className="text-dark-green/60 text-sm mt-1">{generatedTool.description}</p>
        </div>
        <button
          onClick={onBack}
          className="flex-shrink-0 flex items-center gap-1.5 text-dark-green/40 hover:text-dark-green text-xs font-semibold transition-colors mt-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
      </div>

      <ToolPreview tool={generatedTool} format={selectedFormat} />

      <div className="mt-6">
        <EditPanel
          tool={generatedTool}
          format={selectedFormat}
          onChange={(updated) => setGeneratedTool(updated)}
        />
      </div>

      <div className="mt-6">
        <ExportPanel tool={generatedTool} orgDetails={orgDetails} format={selectedFormat} />
      </div>
    </div>
  )
}
