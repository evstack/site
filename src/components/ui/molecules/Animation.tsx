'use client'

import React, { useEffect, useRef } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2'

interface AnimationProps {
  artboard: string
  stateMachine: string
  src?: string
  isMotionComplete?: boolean
}

const Animation = ({
  artboard,
  stateMachine,
  src = '/animations/evolve_site_animations.riv',
  isMotionComplete = true
}: AnimationProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hasStartedRef = useRef(false)

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    onLoadError: (error) => console.error('Error loading Rive file:', error),
    autoplay: true,
    stateMachines: stateMachine,
    // @ts-ignore
    fitCanvasToArtboardHeight: true,
    shouldResizeCanvasToContainer: true,
    autoBind: true
  })

  const animStart = useStateMachineInput(rive, stateMachine, 'animStart')

  useEffect(() => {
    const element = containerRef.current

    if (!isMotionComplete || !element || !animStart || hasStartedRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          animStart.value = true
          hasStartedRef.current = true
          observer.disconnect()
        }
      },
      {
        threshold: 0.4
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [animStart, isMotionComplete])

  return (
    <div ref={containerRef} className="w-full h-full">
      <RiveComponent className="w-full h-full transform-gpu" />
    </div>
  )
}

export default Animation
