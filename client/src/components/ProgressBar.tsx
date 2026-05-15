interface Props {
  currentStep: 1 | 2 | 3
}

const steps = [
  { num: 1, label: 'Your Organisation' },
  { num: 2, label: 'Choose Format' },
  { num: 3, label: 'Your Tool' },
]

export function ProgressBar({ currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-dark-green/10 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-light-green transition-all duration-500 -z-0"
          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
        />
        {steps.map((step) => {
          const done = step.num < currentStep
          const active = step.num === currentStep
          return (
            <div key={step.num} className="flex flex-col items-center gap-2 z-10">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  done
                    ? 'bg-light-green text-white'
                    : active
                    ? 'bg-dark-green text-cream ring-4 ring-light-green/30'
                    : 'bg-white text-dark-green/30 border-2 border-dark-green/10',
                ].join(' ')}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={[
                  'text-xs font-medium hidden sm:block',
                  active ? 'text-dark-green' : done ? 'text-light-green' : 'text-dark-green/30',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
