'use client'
import { content } from '@/content/homepage/data'
import { useEffect, useState } from 'react'
import Badge from '@/components/ui/atoms/Badge'
import { motion } from 'motion/react'
import ArchitectureAnimation from '@/components/ui/molecules/ArchitectureAnimation'

const colorByLayerIndex = (index: number) => {
  switch (index) {
    case 0:
    default:
      return '--blue'
    case 1:
      return '--yellow'
    case 2:
      return '--pink'
  }
}

const getTopParamByIndex = (index: number) => {
  switch (index) {
    case 0:
    default:
      return '185px'
    case 1:
      return '95px'
    case 2:
      return '0'
  }
}
const getHeightByIndex = (index: number) => {
  switch (index) {
    case 0:
    default:
      return 400
    case 1:
      return 450
    case 2:
      return 520
  }
}
const getColorByIndex = (index: number) => {
  switch (index) {
    case 0:
    default:
      return '#94EEFF'
    case 1:
      return '#FFECB6'
    case 2:
      return '#B8A6FF'
  }
}

const Layers = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0)
  const [height, setHeight] = useState<number>(400)

  useEffect(() => {
    setHeight(getHeightByIndex(activeLayer))
  }, [activeLayer])

  return (
    <div className={'relative w-full'}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
        viewport={{ once: true }}
        className={'absolute left-0 transition-all ease-in-out duration-300 hidden xl:block'}
        style={{ bottom: getTopParamByIndex(activeLayer) }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="153"
          height={height}
          viewBox={`0 0 153 ${height}`}
          className={'transition-all ease-in-out duration-300'}
          fill="none"
        >
          <path
            d={`M0.5 ${height}L0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5H152.5`}
            className={'transition-all ease-in-out duration-300'}
            stroke={getColorByIndex(activeLayer)}
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
        viewport={{ once: true }}
        className={'w-full'}
      >
        <div className={'w-full aspect-square'}>
          <ArchitectureAnimation
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            artboard={'STACKS'}
            stateMachine={'State Machine 1'}
          />
        </div>
      </motion.div>
      <div className={'grid grid-cols-1 gap-y-4 mt-4'}>
        {content.architectureSection.layers.map((layer: any, index: number) => (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: index * 0.1 }}
            viewport={{ once: true }}
            key={index}
            onClick={() => setActiveLayer(index)}
            className={`flex flex-col gap-y-1 border-b border-[#1D1D1D] pb-3 pr-4 cursor-pointer`}
          >
            <div
              className={`transition-all ease-in-out duration-500 ${index === activeLayer ? 'translate-x-10' : 'translate-x-6'}`}
            >
              <div
                className={`text-sm font-geist-mono mt-0.5 ${index === activeLayer ? `text-(${colorByLayerIndex(index)})` : 'text-(--darksmoke)'}`}
              >
                {layer.layername}
              </div>
              <div className={'text-white text-base font-medium flex flex-wrap items-center gap-2'}>
                {layer.title}

                {layer.badges && (
                  <div className={'flex flex-wrap items-center gap-2'}>
                    {layer.badges.map((badge: any, badgeIndex: number) => (
                      <Badge key={badgeIndex} variant={badge.variant}>
                        {badge.title}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {layer.text && <p className={'text-(--smoke) text-sm'}>{layer.text}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Layers
