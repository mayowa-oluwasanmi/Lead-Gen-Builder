import { useState } from 'react'

// Safely attempt to import logo — returns empty object if file doesn't exist
const logoModules = import.meta.glob<string>(
  '../assets/avocado-hub-logo.png',
  { eager: true, query: '?url', import: 'default' }
)
const logoUrl = logoModules['../assets/avocado-hub-logo.png'] as string | undefined

export function Navbar() {
  const [imgError, setImgError] = useState(false)
  const showImg = logoUrl && !imgError

  return (
    <header className="bg-dark-green shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showImg ? (
            <img
              src={logoUrl}
              alt="The AVOCADO HUB"
              className="h-9 w-auto object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="font-dm-serif text-cream text-xl tracking-wide leading-none">
              The AVOCADO HUB
            </span>
          )}
        </div>
        <span className="text-cream/70 text-sm font-barlow font-medium hidden sm:block">
          Lead Gen Builder
        </span>
      </div>
    </header>
  )
}
