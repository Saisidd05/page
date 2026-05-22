import { useEffect, useMemo, useRef, useState } from 'react'
import AlgorithmPanel from './components/AlgorithmPanel'
import ComparisonTable from './components/ComparisonTable'
import ThemeToggle from './components/ThemeToggle'
import ExportButton from './components/ExportButton'

const availableAlgorithms = ['FIFO', 'LRU', 'Optimal', 'MFU']

const initialState = {
  reference: '',
  frames: '3',
  selectedAlgorithms: [...availableAlgorithms],
}

const emptyResults = {
  FIFO: null,
  LRU: null,
  Optimal: null,
  MFU: null,
}

function App() {
  const [form, setForm] = useState(initialState)
  const [results, setResults] = useState(emptyResults)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resultsRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const hasResults = useMemo(
    () => Object.values(results).some(Boolean),
    [results]
  )

  const activeAlgorithms = useMemo(
    () => Object.keys(results).filter((name) => results[name]),
    [results]
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAlgorithmToggle = (algorithm) => {
    setForm((prev) => {
      const isSelected = prev.selectedAlgorithms.includes(algorithm)
      const selectedAlgorithms = isSelected
        ? prev.selectedAlgorithms.filter((name) => name !== algorithm)
        : [...prev.selectedAlgorithms, algorithm]

      return {
        ...prev,
        selectedAlgorithms,
      }
    })
  }

  const resetForm = () => {
    setForm({ ...initialState, selectedAlgorithms: [...availableAlgorithms] })
    setResults(emptyResults)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!form.reference.trim()) {
      setError('Please provide a reference string.')
      setIsSubmitting(false)
      return
    }

    if (!form.selectedAlgorithms.length) {
      setError('Please select at least one algorithm.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: form.reference,
          frames: form.frames,
          algorithms: form.selectedAlgorithms,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Unable to calculate page faults.')
        setResults(emptyResults)
        setIsSubmitting(false)
        return
      }

      setResults(payload.algorithms)
      setHistory((prev) => [
        {
          id: Date.now(),
          reference: payload.reference.join(', '),
          frames: payload.frameCount,
          algorithms: payload.algorithms,
          selectedAlgorithms: form.selectedAlgorithms,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ])
      setIsSubmitting(false)
    } catch (err) {
      setError('Network issue: could not reach the backend.')
      setResults(emptyResults)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen theme-surface text-current site-overlay">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border theme-border theme-panel section-glow p-6 backdrop-blur-xl sm:p-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Operating Systems Learning</p>
              <h1 className="mt-2 text-3xl font-semibold text-current sm:text-4xl">Page Fault Analyzer</h1>
              <p className="mt-3 max-w-2xl theme-muted">
                Compare FIFO, LRU, Optimal, and MFU page replacement algorithms with interactive step-by-step simulation.
              </p>
            </div>
            <ThemeToggle />
          </header>

          <section className="grid gap-8 xl:grid-cols-[0.9fr_0.7fr]">
            <article className="space-y-6 rounded-3xl border theme-border theme-card p-6 shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-current">Input & Controls</h2>
                  <p className="mt-1 text-sm theme-muted">Enter a reference sequence and choose how many frames to simulate.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full theme-button px-4 py-2 text-sm font-semibold text-current transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="space-y-2 text-sm theme-muted">
                  Reference String / Reference Keys
                  <textarea
                    name="reference"
                    rows="3"
                    value={form.reference}
                    onChange={handleChange}
                    placeholder="7,0,1,2,0,3,0,4,2,3,0,3,2"
                    className="w-full rounded-3xl border theme-border theme-input px-4 py-3 text-current outline-none transition focus:border-accent focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <label className="space-y-2 text-sm theme-muted">
                  Number of Frames
                  <input
                    type="number"
                    min="1"
                    name="frames"
                    value={form.frames}
                    onChange={handleChange}
                    className="w-full rounded-3xl border theme-border theme-input px-4 py-3 text-current outline-none transition focus:border-accent focus:ring-2 focus:ring-cyan-500/20"
                  />
                </label>

                <div className="grid gap-2 rounded-3xl border theme-border theme-card p-4">
                  <p className="text-sm font-semibold text-current">Select Algorithms</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAlgorithms.map((algorithm) => (
                      <label
                        key={algorithm}
                        className={`inline-flex items-center gap-3 rounded-2xl border p-3 text-current transition-all duration-300 ease-out cursor-pointer ${form.selectedAlgorithms.includes(algorithm)
                          ? 'border-cyan-300 bg-cyan-100/25 text-slate-950 dark:border-cyan-500 dark:bg-cyan-500/15 dark:text-slate-100'
                          : 'border-theme-border bg-transparent hover:border-cyan-300 hover:bg-cyan-100/20 dark:hover:bg-cyan-500/10'}`}
                      >
                        <input
                          type="checkbox"
                          checked={form.selectedAlgorithms.includes(algorithm)}
                          onChange={() => handleAlgorithmToggle(algorithm)}
                          className="h-4 w-4 rounded border theme-border text-accent focus:ring-accent"
                        />
                        <span>{algorithm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="rounded-3xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full theme-button px-6 py-3 text-sm font-semibold text-current transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Calculating...' : 'Calculate'}
                </button>
              </form>
            </article>

            <article className="space-y-6 rounded-3xl border theme-border theme-card p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-current">Live Summary</h2>
              <div className="grid gap-4 text-sm theme-muted">
                <div className="rounded-3xl border theme-border theme-panel p-4">
                  <p className="theme-muted">Reference</p>
                  <p className="mt-2 text-base text-current">{form.reference || 'Awaiting input'}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border theme-border theme-panel p-4">
                    <p className="theme-muted">Frames</p>
                    <p className="mt-2 text-base text-current">{form.frames}</p>
                  </div>
                  <div className="rounded-3xl border theme-border theme-panel p-4">
                    <p className="theme-muted">Algorithm History</p>
                    <p className="mt-2 text-base text-current">{history.length} run(s)</p>
                  </div>
                </div>
                <ExportButton targetRef={resultsRef} disabled={!hasResults} />
              </div>
            </article>
          </section>

          {hasResults ? (
            <div ref={resultsRef} className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-3">
                {activeAlgorithms.map((algorithm) => (
                  <AlgorithmPanel
                    key={algorithm}
                    name={algorithm}
                    data={results[algorithm]}
                  />
                ))}
              </div>

              <ComparisonTable results={results} />

              {history.length > 0 && (
                <section className="rounded-3xl border theme-border theme-panel p-6">
                  <h2 className="text-xl font-semibold text-current">Execution History</h2>
                  <div className="mt-4 grid gap-4">
                    {history.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="rounded-3xl border theme-border theme-card p-4">
                        <p className="text-sm theme-muted">{entry.timestamp}</p>
                        <p className="mt-2 text-current">Reference: {entry.reference}</p>
                        <p className="theme-muted">Frames: {entry.frames}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed theme-border theme-card p-8 text-center theme-muted">
              Enter values and click Calculate to explore algorithm behavior.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
