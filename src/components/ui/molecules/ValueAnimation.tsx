'use client'

import React, { useEffect, useRef } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2'

interface AnimationProps {
  artboard: string
  stateMachine: string
  src?: string
  // eslint-disable-next-line no-unused-vars
  setActiveLayer: (activeLayer: number) => void
  activeLayer: number
}

const ValueAnimation = ({
  artboard,
  stateMachine,
  src = '/animations/evolve_site_animations.riv',
  setActiveLayer,
  activeLayer
}: AnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastRiveValueRef = useRef<number | null>(null)

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

  const riveIndexNum = useStateMachineInput(rive, stateMachine, 'sectionNum')

  useEffect(() => {
    if (riveIndexNum) {
      // eslint-disable-next-line react-hooks/immutability
      riveIndexNum.value = activeLayer
      lastRiveValueRef.current = activeLayer
    }
  }, [activeLayer, riveIndexNum])

  useEffect(() => {
    if (!rive || !riveIndexNum) return

    let frameId = 0

    const syncFromRive = () => {
      const nextValue = Number(riveIndexNum.value)

      if (!Number.isNaN(nextValue) && nextValue !== lastRiveValueRef.current) {
        lastRiveValueRef.current = nextValue

        if (nextValue !== activeLayer) {
          setActiveLayer(nextValue)
        }
      }

      frameId = window.requestAnimationFrame(syncFromRive)
    }

    frameId = window.requestAnimationFrame(syncFromRive)

    return () => window.cancelAnimationFrame(frameId)
  }, [rive, riveIndexNum, activeLayer, setActiveLayer])

  return (
    <div ref={containerRef} className="w-full h-full">
      <RiveComponent className="w-full h-full" />
    </div>
  )
}

export default ValueAnimation
