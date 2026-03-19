'use client'

import { useState } from 'react'
import { content } from '@/content/homepage/data'
import FeatureAccordion from '@/components/ui/molecules/FeatureAccordion'
import { motion } from 'motion/react'
import ValueAnimation from '@/components/ui/molecules/ValueAnimation'

const ValuePropSection = () => {
  const [openIndex, setOpenIndex] = useState<number>(0)

  const overlayColors = ['var(--vid-purple)', 'var(--yellow)', 'var(--blue)', 'var(--vid-grey)']
  const overlayColor =
    openIndex !== null ? (overlayColors[openIndex] ?? 'var(--purple)') : 'var(--purple)'

  return (
    <section id="value-prop" className={'pt-8 md:pt-13 pb-13 md:pb-25'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2'}>
          <div className={'text-center'}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              viewport={{ once: true }}
            >
              {content.valuePropSection.subtitle}
            </motion.h2>
          </div>
          <div className={'text-center'}>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              {content.valuePropSection.title}
            </motion.h3>
          </div>
        </div>

        <div className={'flex flex-wrap rounded-3xl bg-white mt-12 md:h-128 overflow-hidden'}>
          <div className={'w-full md:w-1/2 p-8 md:p-16 flex flex-wrap gap-y-0'}>
            {content.valuePropSection.features.map((feature, index) => (
              <FeatureAccordion
                index={index}
                key={index}
                feature={feature}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(() => index || 0)}
              />
            ))}
          </div>

          <div className={'w-full md:w-1/2 hidden md:block'}>
            <div className={'w-full h-full relative max-md:aspect-square'}>
              <div
                className={
                  'absolute top-0 left-0 w-full h-full mix-blend-overlay transition-all ease-in-out duration-500'
                }
                style={{ backgroundColor: overlayColor }}
              />
              <div className={'w-full h-full absolute top-0 left-0'}>
                <ValueAnimation
                  artboard={'ValueSection'}
                  stateMachine={'State Machine 1'}
                  activeLayer={openIndex}
                  setActiveLayer={setOpenIndex}
                />
              </div>
              <video
                src={'/videos/value-video.mp4'}
                autoPlay={true}
                loop={true}
                muted={true}
                className={'w-full h-full object-cover pointer-events-none'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValuePropSection
