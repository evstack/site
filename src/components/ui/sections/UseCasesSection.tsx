'use client'
import React, { Fragment, useState } from 'react'
import { content } from '@/content/homepage/data'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import { motion } from 'motion/react'
import Animation from '@/components/ui/molecules/Animation'

const UseCasesSection = () => {
  const [completedAnimations, setCompletedAnimations] = useState<Record<string, boolean>>({})

  const markAnimationComplete = (key: string) => {
    setCompletedAnimations((prev) => {
      if (prev[key]) return prev

      return {
        ...prev,
        [key]: true
      }
    })
  }

  return (
    <section className={'py-12 md:py-25'}>
      <div className={'container'}>
        <div className={'grid grid-cols-24'}>
          <div className={'col-span-24 md:col-span-8 max-md:pb-12'}>
            <div className={'flex flex-wrap h-full'}>
              <div className={'flex flex-col gap-y-2'}>
                <div className={'text-left'}>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                    viewport={{ once: true }}
                    className={''}
                  >
                    {content.useCasesSection.subtitle}
                  </motion.h2>
                </div>
                <div className={'text-left'}>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    viewport={{ once: true }}
                    className={''}
                  >
                    {content.useCasesSection.title}
                  </motion.h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
                  viewport={{ once: true }}
                  className={'pt-4 md:pt-6'}
                >
                  <Link href={content.useCasesSection.cta.href}>
                    <Button>{content.useCasesSection.cta.text}</Button>
                  </Link>
                </motion.div>
              </div>
              <div className={'self-end max-md:pt-12'}>
                <div className={'flex gap-x-8'}>
                  {content.useCasesSection.stats.map((stat, index) => (
                    <div key={index} className={'flex flex-col flex-wrap gap-y-2'}>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                        className={'mb-6 origin-center'}
                      >
                        {stat.icon}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                        className={
                          'text-[42px] lg:text-[56px] font-medium tracking-[-0.08em] leading-[0.9em]'
                        }
                      >
                        {stat.text}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                        className={
                          'text-xs md:text-sm font-geist-mono font-medium uppercase text-(--darkgray)'
                        }
                      >
                        {stat.title}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={'col-span-24 md:col-[11/span_14]'}>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-1'}>
              <div className={'flex flex-col max-md:gap-y-1'}>
                {content.useCasesSection.boxes
                  .filter((_, index) => index % 2 === 0)
                  .map((box, index) => {
                    const animationKey = `left-${index}`

                    return (
                      <Fragment key={index}>
                        <div
                          className={'w-full rounded-2xl bg-diagonal hidden md:block aspect-39/10'}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 1.1 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.1,
                            delay: 0.2 + index * 0.1
                          }}
                          viewport={{ once: true }}
                          onAnimationComplete={() => markAnimationComplete(animationKey)}
                          className={
                            'p-8 md:p-4 lg:p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap transform-gpu will-change-transform'
                          }
                        >
                          <div
                            className={
                              'flex flex-1 items-center justify-center mx-auto max-w-full overflow-hidden'
                            }
                          >
                            {box.animation && (
                              <div className={'aspect-40/20 w-full'}>
                                <Animation
                                  artboard={box.animation.artboard}
                                  stateMachine={box.animation.stateMachine}
                                  isMotionComplete={completedAnimations[animationKey]}
                                />
                              </div>
                            )}
                          </div>
                          <div className={'self-end'}>
                            <motion.h4
                              initial={{ opacity: 0, x: 10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
                              viewport={{ once: true }}
                              className={'mb-2'}
                            >
                              {box.title}
                            </motion.h4>
                            <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
                              viewport={{ once: true }}
                              className={
                                'text-sm md:text-xs lg:text-sm text-(--darkgray) leading-[1.71em]'
                              }
                            >
                              {box.text}
                            </motion.p>
                          </div>
                        </motion.div>
                      </Fragment>
                    )
                  })}
              </div>
              <div className={'flex flex-col max-md:gap-y-1'}>
                {content.useCasesSection.boxes
                  .filter((_, index) => index % 2 === 1)
                  .map((box, index) => {
                    const animationKey = `right-${index}`

                    return (
                      <Fragment key={index}>
                        <motion.div
                          initial={{ opacity: 0, scale: 1.1 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            type: 'spring',
                            bounce: 0.1,
                            delay: 0.2 + index * 0.1
                          }}
                          viewport={{ once: true }}
                          onAnimationComplete={() => markAnimationComplete(animationKey)}
                          className={
                            'p-8 md:p-4 lg:p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap transform-gpu will-change-transform'
                          }
                        >
                          <motion.div
                            className={
                              'flex flex-1 items-center justify-center mx-auto overflow-hidden'
                            }
                          >
                            {box.animation && (
                              <div className={'aspect-40/20 w-full'}>
                                <Animation
                                  artboard={box.animation.artboard}
                                  stateMachine={box.animation.stateMachine}
                                  isMotionComplete={completedAnimations[animationKey]}
                                />
                              </div>
                            )}
                          </motion.div>
                          <div className={'self-end'}>
                            <motion.h4
                              initial={{ opacity: 0, x: 10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0 }}
                              viewport={{ once: true }}
                              className={'mb-2'}
                            >
                              {box.title}
                            </motion.h4>
                            <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
                              viewport={{ once: true }}
                              className={
                                'text-sm md:text-xs lg:text-sm text-(--darkgray) leading-[1.71em]'
                              }
                            >
                              {box.text}
                            </motion.p>
                          </div>
                        </motion.div>
                        <div
                          className={'w-full rounded-2xl bg-diagonal hidden md:block aspect-39/10'}
                        />
                      </Fragment>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection
