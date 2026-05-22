function ComparisonTable({ results }) {
  const rows = Object.keys(results)
    .filter((name) => results[name])
    .map((name) => ({ name, data: results[name] }))

  return (
    <section className="rounded-3xl border theme-border theme-panel p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-current">Comparison Summary</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: 'var(--border)' }}>
          <thead>
            <tr className="theme-muted">
              <th className="px-4 py-3">Algorithm</th>
              <th className="px-4 py-3">Faults</th>
              <th className="px-4 py-3">Hits</th>
              <th className="px-4 py-3">Fault Rate</th>
              <th className="px-4 py-3">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="theme-card">
                <td className="px-4 py-4 font-medium text-current">{row.name}</td>
                <td className="px-4 py-4 text-current">{row.data?.totalFaults ?? '-'}</td>
                <td className="px-4 py-4 text-current">{row.data?.totalHits ?? '-'}</td>
                <td className="px-4 py-4 text-current">{row.data ? `${row.data.faultRate}%` : '-'}</td>
                <td className="px-4 py-4 text-current">{row.data ? `${row.data.successRate}%` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ComparisonTable
