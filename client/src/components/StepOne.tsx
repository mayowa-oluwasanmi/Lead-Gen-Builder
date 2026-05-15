import { useState } from 'react'
import type { OrgDetails } from '../types'

interface Props {
  onSubmit: (details: OrgDetails) => void
  initialValues?: OrgDetails
}

interface FieldConfig {
  key: keyof OrgDetails
  label: string
  placeholder: string
  hint: string
  required: boolean
  rows: number
}

const fields: FieldConfig[] = [
  {
    key: 'orgName',
    label: 'Organisation Name',
    placeholder: 'e.g. Green Futures CIC',
    hint: 'The name of your charity, CIC or social enterprise.',
    required: true,
    rows: 1,
  },
  {
    key: 'mission',
    label: 'Mission',
    placeholder: 'e.g. We support young people to develop green skills and access sustainable careers.',
    hint: 'What is the core purpose of your organisation? (1–3 sentences)',
    required: true,
    rows: 3,
  },
  {
    key: 'vision',
    label: 'Vision',
    placeholder: 'e.g. A future where every young person has the opportunity to contribute to a green economy.',
    hint: 'What long-term change are you working towards? (optional)',
    required: false,
    rows: 2,
  },
  {
    key: 'activities',
    label: 'Key Activities',
    placeholder: 'e.g. Training programmes, employability workshops, employer partnerships, mentoring.',
    hint: 'What services, programmes or initiatives do you deliver?',
    required: true,
    rows: 3,
  },
  {
    key: 'audience',
    label: 'Target Audience',
    placeholder: 'e.g. Young people aged 16–25 who are NEET, and local employers in the green sector.',
    hint: 'Who are you trying to reach and support?',
    required: true,
    rows: 2,
  },
]

export function StepOne({ onSubmit, initialValues }: Props) {
  const [values, setValues] = useState<OrgDetails>(
    initialValues ?? { orgName: '', mission: '', vision: '', activities: '', audience: '' }
  )
  const [errors, setErrors] = useState<Partial<Record<keyof OrgDetails, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof OrgDetails, boolean>>>({})

  function validate(): boolean {
    const newErrors: Partial<Record<keyof OrgDetails, string>> = {}
    fields.forEach((f) => {
      if (f.required && !values[f.key].trim()) {
        newErrors[f.key] = `${f.label} is required.`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allTouched = Object.fromEntries(fields.map((f) => [f.key, true]))
    setTouched(allTouched as typeof touched)
    if (validate()) {
      onSubmit(values)
    }
  }

  function handleBlur(key: keyof OrgDetails) {
    setTouched((prev) => ({ ...prev, [key]: true }))
    if (fields.find((f) => f.key === key)?.required && !values[key].trim()) {
      setErrors((prev) => ({
        ...prev,
        [key]: `${fields.find((f) => f.key === key)?.label} is required.`,
      }))
    } else {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-green mb-2">Tell us about your organisation</h1>
        <p className="text-dark-green/60 text-sm leading-relaxed">
          The more detail you give, the more tailored your lead gen tool will be. This takes about
          two minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          {fields.map((field) => {
            const hasError = touched[field.key] && errors[field.key]
            const isTextarea = field.rows > 1
            const inputClass = [
              'w-full px-4 py-3 rounded-lg border-2 text-dark-green placeholder-dark-green/30',
              'font-barlow text-sm leading-relaxed outline-none transition-colors duration-200',
              'resize-none',
              hasError
                ? 'border-red-400 bg-red-50'
                : 'border-dark-green/10 bg-cream/30 focus:border-light-green focus:bg-white',
            ].join(' ')

            return (
              <div key={field.key}>
                <label className="block mb-1.5">
                  <span className="text-sm font-semibold text-dark-green">
                    {field.label}
                    {field.required && <span className="text-light-green ml-0.5">*</span>}
                  </span>
                </label>
                <p className="text-xs text-dark-green/50 mb-2">{field.hint}</p>
                {isTextarea ? (
                  <textarea
                    rows={field.rows}
                    className={inputClass}
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    onBlur={() => handleBlur(field.key)}
                  />
                ) : (
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    onBlur={() => handleBlur(field.key)}
                  />
                )}
                {hasError && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errors[field.key]}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-light-green hover:bg-dark-green text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            Analyse My Organisation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
