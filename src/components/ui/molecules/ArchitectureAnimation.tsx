'use client'

import React, { useEffect, useRef } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2'

interface AnimationProps {
  artboard: string
  stateMachine: string
  src?: string
  activeLayer: number
}

const ArchitectureAnimation = ({
  artboard,
  stateMachine,
  src = '/animations/evolve_site_animations.riv',
  activeLayer
}: AnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { rive, RiveComponent } = useRive({
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

  const riveIndexNum = useStateMachineInput(rive, stateMachine, 'start')

  useEffect(() => {
    if (riveIndexNum) {
      // eslint-disable-next-line react-hooks/immutability
      riveIndexNum.value = activeLayer
    }
  }, [activeLayer, riveIndexNum])

  return (
    <div ref={containerRef} className="w-full h-full">
      <RiveComponent className="w-full h-full" />
    </div>
  )
}

export default ArchitectureAnimation
