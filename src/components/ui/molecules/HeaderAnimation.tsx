import React, { useEffect } from 'react'
import { useRive } from '@rive-app/react-webgl2'

const HeaderAnimation = () => {
  const [pointerEvents, setPointerEvents] = React.useState(true)

  const { RiveComponent } = useRive({
    src: '/animations/evolve_site_animations.riv',
    artboard: 'HEADER',
    onLoadError: (error) => console.error('Error loading Rive file:', error),
    autoplay: true,
    stateMachines: 'HEADER_ANIMATION',
    // @ts-ignore
    fitCanvasToArtboardHeight: true,
    shouldResizeCanvasToContainer: true,
    shouldUseIntersectionObserver: true,
    autoBind: false
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPointerEvents(false)
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [])

  return <RiveComponent className={`w-full h-full ${pointerEvents ? 'pointer-events-none' : ''}`} />
}

export default HeaderAnimation
