'use client'

import React, { useEffect } from 'react'
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber
} from '@rive-app/react-webgl2'

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
  activeLayer
}: AnimationProps) => {
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

  const viewModel = useViewModel(rive, { name: 'ViewModel1' })
  const instance = useViewModelInstance(viewModel, { name: 'sectionNum_01' })

  useEffect(() => {
    if (rive && instance) {
      rive.bindViewModelInstance(instance)
    }
  }, [rive, instance])

  const { setValue: setSectionNum } = useViewModelInstanceNumber('sectionNum', instance)

  useEffect(() => {
    if (instance) {
      setSectionNum(activeLayer)
    }
  }, [activeLayer, instance, setSectionNum])

  return (
    <div className="w-full h-full">
      <RiveComponent className="w-full h-full" />
    </div>
  )
}

export default ValueAnimation
