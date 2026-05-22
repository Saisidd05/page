function MemoryGraphic() {
  return (
    <section className="rounded-3xl border theme-border theme-card p-6 shadow-xl overflow-hidden">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Memory Visualization</p>
          <h3 className="text-2xl font-semibold text-current">Page Fault Flow</h3>
        </div>
        <p className="max-w-xl text-sm theme-muted">
          See frames, reference requests, and page faults in a simplified diagram that explains algorithm behavior.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border theme-border bg-gradient-to-br from-slate-900/5 via-transparent to-cyan-100/10 p-4">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />
        <svg viewBox="0 0 620 270" className="h-[18rem] w-full">
          <defs>
            <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(34, 211, 238, 0.2)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.05)" />
            </linearGradient>
          </defs>

          <rect x="16" y="38" width="165" height="180" rx="24" fill="url(#cardGradient)" />
          <rect x="230" y="38" width="165" height="180" rx="24" fill="url(#cardGradient)" />
          <rect x="444" y="38" width="165" height="180" rx="24" fill="url(#cardGradient)" />

          <text x="98" y="60" textAnchor="middle" fontSize="14" fill="var(--muted)">Frame 1</text>
          <text x="312" y="60" textAnchor="middle" fontSize="14" fill="var(--muted)">Frame 2</text>
          <text x="527" y="60" textAnchor="middle" fontSize="14" fill="var(--muted)">Frame 3</text>

          <g fill="none" stroke="var(--border)" strokeWidth="1.5">
            <rect x="34" y="82" width="132" height="32" rx="12" />
            <rect x="34" y="124" width="132" height="32" rx="12" />
            <rect x="34" y="166" width="132" height="32" rx="12" />

            <rect x="248" y="82" width="132" height="32" rx="12" />
            <rect x="248" y="124" width="132" height="32" rx="12" />
            <rect x="248" y="166" width="132" height="32" rx="12" />

            <rect x="462" y="82" width="132" height="32" rx="12" />
            <rect x="462" y="124" width="132" height="32" rx="12" />
            <rect x="462" y="166" width="132" height="32" rx="12" />
          </g>

          <g fontSize="18" fontWeight="700" fill="var(--text)">
            <text x="100" y="104" textAnchor="middle">7</text>
            <text x="100" y="146" textAnchor="middle">0</text>
            <text x="100" y="188" textAnchor="middle">1</text>

            <text x="314" y="104" textAnchor="middle">2</text>
            <text x="314" y="146" textAnchor="middle">0</text>
            <text x="314" y="188" textAnchor="middle">3</text>

            <text x="528" y="104" textAnchor="middle">0</text>
            <text x="528" y="146" textAnchor="middle">4</text>
            <text x="528" y="188" textAnchor="middle">2</text>
          </g>

          <path d="M 32 244 C 120 190 220 190 308 244" fill="none" stroke="rgba(14,165,233,0.35)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 308 244 L 296 230 L 308 238 L 320 230 Z" fill="rgba(14,165,233,0.65)" />
          <text x="153" y="228" fontSize="13" fill="var(--muted)">page fault</text>

          <g fill="var(--panel)" stroke="var(--border)" strokeWidth="1.2">
            <rect x="36" y="14" width="72" height="28" rx="14" />
            <rect x="120" y="14" width="72" height="28" rx="14" />
            <rect x="204" y="14" width="72" height="28" rx="14" />
            <rect x="288" y="14" width="72" height="28" rx="14" />
            <rect x="372" y="14" width="72" height="28" rx="14" />
            <rect x="456" y="14" width="72" height="28" rx="14" />
          </g>

          <g fontSize="12" fill="var(--text)" fontWeight="600">
            <text x="72" y="33" textAnchor="middle">7</text>
            <text x="156" y="33" textAnchor="middle">0</text>
            <text x="240" y="33" textAnchor="middle">1</text>
            <text x="324" y="33" textAnchor="middle">2</text>
            <text x="408" y="33" textAnchor="middle">0</text>
            <text x="492" y="33" textAnchor="middle">3</text>
          </g>

          <g>
            <rect x="56" y="204" width="48" height="34" rx="12" fill="rgba(34,211,238,0.2)" />
            <rect x="128" y="190" width="48" height="48" rx="12" fill="rgba(34,211,238,0.35)" />
            <rect x="200" y="170" width="48" height="68" rx="12" fill="rgba(14,165,233,0.55)" />
            <rect x="272" y="160" width="48" height="78" rx="12" fill="rgba(6,182,212,0.75)" />
            <rect x="344" y="184" width="48" height="54" rx="12" fill="rgba(56,189,248,0.35)" />
          </g>
        </svg>
      </div>
    </section>
  )
}

export default MemoryGraphic
