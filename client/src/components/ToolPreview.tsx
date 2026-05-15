import { useState } from 'react'
import type { GeneratedTool, FormatType } from '../types'

interface Props {
  tool: GeneratedTool
  format: FormatType
}

function ChecklistPreview({ tool }: { tool: GeneratedTool }) {
  const items = tool.items ?? []
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [showGate, setShowGate] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function toggle(idx: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      if (next.size >= Math.ceil(items.length * 0.7)) setShowGate(true)
      return next
    })
  }

  const pct = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-light-green">
            {checked.size} of {items.length} completed
          </span>
          <span className="text-xs text-dark-green/40">{pct}%</span>
        </div>
        <div className="h-2 bg-cream rounded-full overflow-hidden">
          <div
            className="h-2 bg-light-green rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={[
              'w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all duration-150',
              checked.has(i) ? 'opacity-60' : 'hover:bg-cream/50',
            ].join(' ')}
          >
            <span
              className={[
                'flex-shrink-0 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center mt-0.5 transition-all',
                checked.has(i)
                  ? 'border-light-green bg-light-green'
                  : 'border-dark-green/20',
              ].join(' ')}
            >
              {checked.has(i) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="flex flex-col gap-0.5">
              <span
                className={[
                  'text-sm font-semibold leading-snug',
                  checked.has(i) ? 'line-through text-dark-green/40' : 'text-dark-green',
                ].join(' ')}
              >
                {item.title}
              </span>
              <span className="text-xs text-dark-green/50 leading-relaxed">{item.detail}</span>
            </span>
          </button>
        ))}
      </div>

      {showGate && (
        <div className="mt-5 pt-5 border-t-2 border-cream">
          {!submitted ? (
            <>
              <h3 className="font-bold text-dark-green mb-1">{tool.emailGateTitle}</h3>
              <p className="text-sm text-dark-green/60 mb-4 leading-relaxed">{tool.emailGateCopy}</p>
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-dark-green/10 text-sm outline-none focus:border-light-green transition-colors font-barlow"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border-2 border-dark-green/10 text-sm outline-none focus:border-light-green transition-colors font-barlow"
                />
              </div>
              <button
                onClick={() => { if (name && email) setSubmitted(true) }}
                className="w-full bg-light-green hover:bg-dark-green text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                {tool.ctaText}
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-bold text-dark-green mb-1">You're all set!</h3>
              <p className="text-sm text-dark-green/60">We'll be in touch with your next steps soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuizPreview({ tool, format }: { tool: GeneratedTool; format: FormatType }) {
  const questions = tool.questions ?? []
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showGate, setShowGate] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const formatLabel =
    format === 'audit' ? 'Audit' : format === 'self-assessment' ? 'Assessment' : 'Quiz'

  if (!started) {
    return (
      <div className="text-center py-4">
        <span className="inline-block bg-light-green/10 text-light-green text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          {formatLabel} · {questions.length} questions
        </span>
        <p className="text-dark-green/60 text-sm mb-6 leading-relaxed">
          Click start to preview your {formatLabel.toLowerCase()} exactly as your audience will experience it.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="bg-light-green hover:bg-dark-green text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
        >
          Start Preview →
        </button>
      </div>
    )
  }

  if (showGate) {
    return (
      <div className="py-2">
        {!submitted ? (
          <>
            <h3 className="font-bold text-dark-green mb-1 text-lg">{tool.emailGateTitle}</h3>
            <p className="text-sm text-dark-green/60 mb-4 leading-relaxed">{tool.emailGateCopy}</p>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-dark-green/10 text-sm outline-none focus:border-light-green transition-colors font-barlow"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-dark-green/10 text-sm outline-none focus:border-light-green transition-colors font-barlow"
              />
            </div>
            <button
              onClick={() => { if (name && email) setSubmitted(true) }}
              className="w-full bg-light-green hover:bg-dark-green text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {tool.ctaText}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="font-bold text-dark-green text-lg mb-1">Thank you!</h3>
            <p className="text-sm text-dark-green/60 leading-relaxed">
              Your personalised results are on their way. We'll be in touch very soon.
            </p>
          </div>
        )}
      </div>
    )
  }

  const q = questions[current]
  const pct = Math.round(((current + 1) / questions.length) * 100)

  return (
    <div>
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-light-green">
            Question {current + 1} of {questions.length}
          </span>
          <span className="text-xs text-dark-green/40">{pct}%</span>
        </div>
        <div className="h-2 bg-cream rounded-full overflow-hidden">
          <div
            className="h-2 bg-light-green rounded-full transition-all duration-400"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="font-bold text-dark-green text-base leading-snug mb-4">{q.question}</p>

      <div className="space-y-2 mb-6">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setAnswers((prev) => ({ ...prev, [current]: i }))}
            className={[
              'w-full text-left px-4 py-3 rounded-lg border-2 text-sm transition-all duration-150 font-barlow',
              answers[current] === i
                ? 'border-light-green bg-light-green/10 font-semibold text-dark-green'
                : 'border-dark-green/10 hover:border-light-green/50 hover:bg-cream/50 text-dark-green',
            ].join(' ')}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 text-dark-green/40 hover:text-dark-green disabled:opacity-0 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={() => {
            if (current < questions.length - 1) setCurrent((c) => c + 1)
            else setShowGate(true)
          }}
          disabled={answers[current] === undefined}
          className="bg-light-green hover:bg-dark-green disabled:bg-dark-green/20 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-1.5"
        >
          {current < questions.length - 1 ? 'Next' : 'See Results'}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function ToolPreview({ tool, format }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="bg-dark-green px-6 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-cream/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-cream/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-cream/20" />
        <span className="ml-3 text-cream/50 text-xs">Preview — as your audience will see it</span>
      </div>
      <div className="p-6">
        {format === 'checklist' ? (
          <ChecklistPreview tool={tool} />
        ) : (
          <QuizPreview tool={tool} format={format} />
        )}
      </div>
    </div>
  )
}
