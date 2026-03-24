'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [rendered, setRendered] = useState(false)

  // Lazy load — only render when the diagram scrolls into view
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || rendered || !containerRef.current) return

    const renderChart = async () => {
      const mermaid = (await import('mermaid')).default
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose'
      })
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
      try {
        const { svg } = await mermaid.render(id, chart)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          setRendered(true)
        }
      } catch {
        // Mermaid parse error — show raw code as fallback
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-xs overflow-auto p-4 bg-fd-secondary rounded-lg"><code>${chart.replace(/</g, '&lt;')}</code></pre>`
        }
      }
    }
    renderChart()
  }, [isVisible, chart, rendered])

  return (
    <div ref={containerRef} className="my-4 flex justify-center [&>svg]:max-w-full min-h-[60px]">
      {!rendered && (
        <div className="flex items-center gap-2 text-fd-muted-foreground text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading diagram...
        </div>
      )}
    </div>
  )
}
