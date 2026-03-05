'use client'
import React, { Fragment } from 'react'
import { content } from '@/content/homepage/data'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import Image from 'next/image'
import { motion } from 'motion/react'

const UseCasesSection = () => {
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
                          'text-[42px] md:text-[56px] font-medium tracking-[-0.08em] leading-[0.9em]'
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
                  .map((box, index) => (
                    <Fragment key={index}>
                      <motion.div
                        initial={{ aspectRatio: '39/0' }}
                        whileInView={{ aspectRatio: '39/10' }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                        viewport={{ once: true }}
                        className={'w-full rounded-2xl bg-diagonal hidden md:block'}
                      />
                      <div className={'p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap'}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                          viewport={{ once: true }}
                          className={'flex items-center justify-center mx-auto'}
                        >
                          {box.animation && (
                            <Image
                              src={box.animation}
                              alt={box.title}
                              width={400}
                              height={400}
                              className={'max-h-37.5 w-auto'}
                            />
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
                            className={'text-sm text-(--darkgray) leading-[1.71em]'}
                          >
                            {box.text}
                          </motion.p>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </div>
              <div className={'flex flex-col max-md:gap-y-1'}>
                {content.useCasesSection.boxes
                  .filter((_, index) => index % 2 === 1)
                  .map((box, index) => (
                    <Fragment key={index}>
                      <div className={'p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap'}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                          viewport={{ once: true }}
                          className={'flex items-center justify-center mx-auto'}
                        >
                          {box.animation && (
                            <Image
                              src={box.animation}
                              alt={box.title}
                              width={400}
                              height={400}
                              className={'max-h-37.5 w-auto'}
                            />
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
                            className={'text-sm text-(--darkgray) leading-[1.71em]'}
                          >
                            {box.text}
                          </motion.p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ aspectRatio: '39/0' }}
                        whileInView={{ aspectRatio: '39/10' }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                        viewport={{ once: true }}
                        className={'w-full rounded-2xl bg-diagonal hidden md:block'}
                      />
                    </Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection
