'use client'

import React, { useRef } from 'react'
import { useRive } from '@rive-app/react-webgl2'

interface AnimationProps {
  artboard: string
  stateMachine: string
  src?: string
}

const ValueAnimationInAccordion = ({
  artboard,
  stateMachine,
  src = '/animations/evolve_site_animations.riv'
}: AnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { RiveComponent } = useRive({
    src,
    artboard,
    onLoadError: (error) => console.error('Error loading Rive file:', error),
    autoplay: true,
    stateMachines: stateMachine,
    // @ts-ignore
    fitCanvasToArtboardHeight: true,
    shouldResizeCanvasToContainer: true,
    autoBind: false
  })

  return (
    <div ref={containerRef} className="w-full aspect-68/52">
      <RiveComponent className="w-full h-full" />
    </div>
  )
}

export default ValueAnimationInAccordion
