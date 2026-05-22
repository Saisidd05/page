import { useMemo } from 'react'

function AlgorithmPanel({ name, data }) {
  const displaySteps = useMemo(() => {
    if (!data?.steps) return []
    return data.steps
  }, [data])

  if (!data) {
    return null
  }

  return (
    <section className="rounded-3xl border theme-border theme-panel p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-current">{name}</h3>
          <p className="mt-1 text-sm theme-muted">Faults and hits in each simulation step.</p>
        </div>
        <div className="rounded-full theme-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">
          {data.totalFaults} faults
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl theme-card p-4 text-sm theme-muted">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border theme-border theme-panel p-4">
          <div>
            <span className="text-xs uppercase theme-muted">Total Hits</span>
            <p className="mt-2 text-xl font-semibold text-current">{data.totalHits}</p>
          </div>
          <div>
            <span className="text-xs uppercase theme-muted">Fault Rate</span>
            <p className="mt-2 text-xl font-semibold text-current">{data.faultRate}%</p>
          </div>
          <div>
            <span className="text-xs uppercase theme-muted">Hit Rate</span>
            <p className="mt-2 text-xl font-semibold text-current">{data.hitRate ?? data.successRate}%</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border theme-border bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(15,23,42,0.78)] p-4 shadow-inner">
        <table className="min-w-full table-auto border-separate border-spacing-0 text-left text-sm">
          <tbody>
            {[...Array(data.steps[0]?.frames.length || 0).keys()].map((frameIndex) => (
              <tr key={frameIndex} className="theme-card">
                <th className="border-b theme-border px-3 py-3 text-left text-xs uppercase tracking-[0.18em] text-accent">Frame {frameIndex + 1}</th>
                {displaySteps.map((step, index) => (
                  <td
                    key={index}
                    className="border-b theme-border px-3 py-3 text-current"
                  >
                    {step.frames[frameIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="theme-panel">
              <th className="border-t theme-border px-3 py-3 text-left text-xs uppercase tracking-[0.18em] text-accent">Faults</th>
              {displaySteps.map((step, index) => (
                <td key={index} className="border-t theme-border px-3 py-3 text-center text-sm font-semibold">
                  <span className={step.hit ? 'text-emerald-400' : 'text-rose-400'}>
                    {step.hit ? '*' : 'F'}
                  </span>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

export default AlgorithmPanel
