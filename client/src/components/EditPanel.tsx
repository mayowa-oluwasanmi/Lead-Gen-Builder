import { useState } from 'react'
import type { GeneratedTool, FormatType } from '../types'

interface Props {
  tool: GeneratedTool
  format: FormatType
  onChange: (tool: GeneratedTool) => void
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border-2 border-dark-green/10 text-sm text-dark-green outline-none focus:border-light-green transition-colors bg-white font-barlow'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-dark-green/50 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

export function EditPanel({ tool, format, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const isChecklist = format === 'checklist'

  function set<K extends keyof GeneratedTool>(key: K, value: GeneratedTool[K]) {
    onChange({ ...tool, [key]: value })
  }

  function setQuestion(qIdx: number, field: 'question', value: string) {
    const questions = [...(tool.questions ?? [])]
    questions[qIdx] = { ...questions[qIdx], [field]: value }
    onChange({ ...tool, questions })
  }

  function setOption(qIdx: number, oIdx: number, value: string) {
    const questions = [...(tool.questions ?? [])]
    const options = [...questions[qIdx].options]
    options[oIdx] = value
    questions[qIdx] = { ...questions[qIdx], options }
    onChange({ ...tool, questions })
  }

  function setItem(idx: number, field: 'title' | 'detail', value: string) {
    const items = [...(tool.items ?? [])]
    items[idx] = { ...items[idx], [field]: value }
    onChange({ ...tool, items })
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-cream/20 transition-colors"
      >
        <div>
          <h2 className="font-bold text-dark-green text-lg">Edit Content</h2>
          <p className="text-dark-green/50 text-sm mt-0.5">Tweak any text before downloading</p>
        </div>
        <svg
          className={`w-5 h-5 text-dark-green/40 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-dark-green/6">
          {/* Core copy fields */}
          <div className="pt-5 space-y-4 mb-6">
            <p className="text-xs font-bold text-dark-green/40 uppercase tracking-wider">Core copy</p>
            <Field label="Title">
              <input
                className={inputCls}
                value={tool.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={tool.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </Field>
            <Field label="Email gate heading">
              <input
                className={inputCls}
                value={tool.emailGateTitle}
                onChange={(e) => set('emailGateTitle', e.target.value)}
              />
            </Field>
            <Field label="Email gate copy">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={tool.emailGateCopy}
                onChange={(e) => set('emailGateCopy', e.target.value)}
              />
            </Field>
            <Field label="CTA button text">
              <input
                className={inputCls}
                value={tool.ctaText}
                onChange={(e) => set('ctaText', e.target.value)}
              />
            </Field>
          </div>

          {/* Questions / checklist items */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-dark-green/40 uppercase tracking-wider">
              {isChecklist ? 'Checklist items' : 'Questions'}
            </p>

            {isChecklist
              ? (tool.items ?? []).map((item, i) => (
                  <div key={i} className="rounded-xl bg-cream/40 p-4 space-y-2">
                    <p className="text-xs font-semibold text-dark-green/40">Item {i + 1}</p>
                    <input
                      className={inputCls}
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => setItem(i, 'title', e.target.value)}
                    />
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={2}
                      placeholder="Detail / why this matters"
                      value={item.detail}
                      onChange={(e) => setItem(i, 'detail', e.target.value)}
                    />
                  </div>
                ))
              : (tool.questions ?? []).map((q, qi) => (
                  <div key={qi} className="rounded-xl bg-cream/40 p-4 space-y-2">
                    <p className="text-xs font-semibold text-dark-green/40">Question {qi + 1}</p>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={2}
                      value={q.question}
                      onChange={(e) => setQuestion(qi, 'question', e.target.value)}
                    />
                    <div className="space-y-1.5 pl-1">
                      {q.options.map((opt, oi) => (
                        <input
                          key={oi}
                          className={inputCls}
                          placeholder={`Option ${oi + 1}`}
                          value={opt}
                          onChange={(e) => setOption(qi, oi, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  )
}
