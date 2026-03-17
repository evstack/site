import React from 'react'
import { useRive } from '@rive-app/react-webgl2'

const HeaderAnimation = () => {
  // 1. Initialize useRive with autoBind: false
  const { RiveComponent } = useRive({
    src: '/animations/hero-animation.riv',
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

  return <RiveComponent className={'w-full h-full'} />
}
export default HeaderAnimation
