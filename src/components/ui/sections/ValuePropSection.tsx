'use client'

import React, { useState } from 'react'
import { content } from '@/content/homepage/data'
import FeatureAccordion from '@/components/ui/molecules/FeatureAccordion'

const ValuePropSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={'pt-13 pb-25'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2'}>
          <div className={'text-center'}>
            <h2>{content.valuePropSection.subtitle}</h2>
          </div>
          <div className={'text-center'}>
            <h3>{content.valuePropSection.title}</h3>
          </div>
        </div>

        <div className={'flex rounded-3xl bg-white mt-12 h-128 overflow-hidden'}>
          <div className={'w-1/2 p-16 flex flex-wrap gap-y-0'}>
            {content.valuePropSection.features.map((feature, index) => (
              <FeatureAccordion
                key={index}
                feature={feature}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
              />
            ))}
          </div>

          <div className={'w-1/2'}>
            <div className={'w-full h-full  relative'}>
              <div
                className={'absolute top-0 left-0 w-full h-full bg-(--purple) mix-blend-overlay'}
              />
              <video
                src={'/videos/value-video.mp4'}
                autoPlay={true}
                loop={true}
                muted={true}
                className={'w-full h-full object-cover'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValuePropSection
