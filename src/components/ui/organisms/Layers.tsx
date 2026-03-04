'use client'
import { content } from '@/content/homepage/data'
import Image from 'next/image'
import { useState } from 'react'
import Badge from '@/components/ui/atoms/Badge'

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
      return '88px'
    case 1:
      return '170px'
    case 2:
      return '274px'
  }
}

const Layers = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0)
  return (
    <div className={'relative'}>
      <div
        className={'absolute left-0 transition-all ease-in-out duration-500'}
        style={{ top: getTopParamByIndex(activeLayer) }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="153"
          height="334"
          viewBox="0 0 153 334"
          fill="none"
        >
          <path d="M0.5 334L0.5 24.5C0.5 11.2452 11.2452 0.5 24.5 0.5H152.5" stroke="#94EEFF" />
        </svg>
      </div>
      <div>
        <Image
          src={'/layers.png'}
          alt="Architecture Layers"
          width={555}
          height={322}
          className={'w-full h-full object-cover'}
        />
      </div>
      <div className={'grid grid-cols-1 gap-y-4 mt-4'}>
        {content.architectureSection.layers.map((layer: any, index: number) => (
          <div
            key={index}
            onClick={() => setActiveLayer(index)}
            className={`flex flex-col gap-y-1 border-b border-[#1D1D1D] pb-3 pr-4 transition-all ease-in-out duration-500 cursor-pointer ${index === activeLayer ? 'pl-10' : 'pl-6'}`}
          >
            <div
              className={`text-sm font-geist-mono mt-0.5 ${index === activeLayer ? `text-(${colorByLayerIndex(index)})` : 'text-(--darksmoke)'}`}
            >
              {layer.layername}
            </div>
            <div className={'text-white text-base font-medium flex items-center gap-x-2'}>
              {layer.title}

              {layer.badges && (
                <div className={'flex items-center gap-x-2'}>
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
        ))}
      </div>
    </div>
  )
}

export default Layers
