'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Plus, Maximize2, X } from 'lucide-react'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lightboxSvgRef = useRef<HTMLDivElement>(null)

  const panZoomRef = useRef<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [svgContent, setSvgContent] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Lazy load — only render when the diagram scrolls into view
  useEffect(() => {
    if (!wrapperRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(wrapperRef.current)
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
          setSvgContent(svg)
          setRendered(true)
        }
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-xs overflow-auto p-4 bg-fd-secondary rounded-lg"><code>${chart.replace(/</g, '&lt;')}</code></pre>`
        }
      }
    }
    renderChart()
  }, [isVisible, chart, rendered])

  // Initialize svg-pan-zoom on lightbox SVG
  useEffect(() => {
    if (!lightboxOpen || !lightboxSvgRef.current || !svgContent) return

    const init = async () => {
      const svgPanZoom = (await import('svg-pan-zoom')).default

      lightboxSvgRef.current!.innerHTML = svgContent
      const svg = lightboxSvgRef.current!.querySelector('svg')
      if (!svg) return

      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.maxWidth = 'none'

      panZoomRef.current = svgPanZoom(svg, {
        zoomEnabled: true,
        controlIconsEnabled: false,
        fit: true,
        center: true,
        minZoom: 0.5,
        maxZoom: 10,
        zoomScaleSensitivity: 0.3
      })
    }

    init()

    return () => {
      if (panZoomRef.current) {
        panZoomRef.current.destroy()
        panZoomRef.current = null
      }
    }
  }, [lightboxOpen, svgContent])

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const handleClick = useCallback(() => {
    if (rendered) setLightboxOpen(true)
  }, [rendered])

  const handleZoomIn = useCallback(() => panZoomRef.current?.zoomIn(), [])
  const handleZoomOut = useCallback(() => panZoomRef.current?.zoomOut(), [])
  const handleReset = useCallback(() => {
    panZoomRef.current?.resetZoom()
    panZoomRef.current?.resetPan()
    panZoomRef.current?.fit()
    panZoomRef.current?.center()
  }, [])

  return (
    <>
      <div ref={wrapperRef} className="my-4 flex justify-center [&>svg]:max-w-full min-h-[60px]">
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
        <div
          ref={containerRef}
          suppressHydrationWarning
          onClick={handleClick}
          className={rendered ? 'cursor-zoom-in' : undefined}
          title={rendered ? 'Click to enlarge' : undefined}
        />
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Controls bar */}
          <div
            className="absolute top-4 right-4 flex items-center gap-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              title="Zoom in"
            >
              <Plus className="size-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              title="Zoom out"
            >
              <Minus className="size-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              title="Fit to view"
            >
              <Maximize2 className="size-4" />
            </button>
            <div className="w-px h-5 bg-white/20 mx-1" />
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors flex items-center gap-1.5"
              title="Close (ESC)"
            >
              <X className="size-4" />
              <span className="text-xs">ESC</span>
            </button>
          </div>

          <div
            className="w-[90vw] h-[85vh] bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={lightboxSvgRef} className="w-full h-full" />
          </div>
        </div>
      )}
    </>
  )
}
