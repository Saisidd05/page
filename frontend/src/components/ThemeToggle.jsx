import { useEffect, useState } from 'react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      className="inline-flex items-center gap-2 rounded-full border theme-border theme-card px-4 py-2 text-sm text-current transition hover:border-accent hover:text-accent-strong"
    >
      <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
      <span className="rounded-full theme-card px-2 py-1 text-xs text-accent">{isDark ? 'ON' : 'OFF'}</span>
    </button>
  )
}

export default ThemeToggle
