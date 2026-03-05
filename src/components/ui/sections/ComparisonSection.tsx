'use client'
import { content } from '@/content/homepage/data'
import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

const ComparisonSection = () => {
  return (
    <section className={'py-12 md:py-25 max-md:px-0! overflow-hidden'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2 max-md:px-4'}>
          <div className={''}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              viewport={{ once: true }}
              className={'text-center'}
            >
              {content.comparisonSection.subtitle}
            </motion.h2>
          </div>
          <div className={''}>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              viewport={{ once: true }}
              className={'text-center'}
            >
              {content.comparisonSection.title}
            </motion.h3>
          </div>
          <div className={'pt-3 flex justify-center'}>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
              viewport={{ once: true }}
              className={'text-(--darkgray) text-sm leading-[1.57em] text-center max-w-167.5'}
            >
              {content.comparisonSection.text}
            </motion.p>
          </div>
        </div>

        <div className={'w-full pt-12'}>
          <div
            className={
              'md:bg-diagonal md:rounded-xlmd:p-4 md:border md:border-(--diagonal) overflow-scroll'
            }
          >
            <div
              className={
                'w-full md:rounded-2xl bg-[#F3F4F4] border border-(--diagonal) md:p-1 max-md:min-w-180'
              }
            >
              <div
                className={'grid'}
                style={{
                  gridTemplateColumns: `repeat(${content.comparisonSection.datatable.columns.length}, 1fr)`
                }}
              >
                {content.comparisonSection.datatable.columns.map((column, index) => (
                  <div
                    key={index}
                    className={twMerge(
                      'flex flex-col gap-y-2 font-normal text-(--darkgray) first:font-medium first:text-black last:font-semibold last:text-black',
                      index === 0 ? 'sticky left-0 backdrop-blur-sm bg-white/5 z-10' : ''
                    )}
                  >
                    <div className={'text-left'}>
                      <motion.h4
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeInOut', delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={
                          'text-base! md:text-[20px]! font-semibold! font-inter text-black bg-white px-6 py-5 rounded-xl shadow-sm m-1 flex items-center gap-x-4'
                        }
                      >
                        {column.icon && (
                          <span className="max-h-[1em] flex items-center [&>svg]:h-full">
                            {column.icon}
                          </span>
                        )}
                        <span>{column.title}</span>
                      </motion.h4>
                      {column.rows.map((row, rowIndex) => (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.5, ease: 'easeInOut', delay: rowIndex * 0.1 }}
                          viewport={{ once: true }}
                          key={rowIndex}
                          className={
                            'flex items-center h-14 px-6 odd:bg-white/50 border-b border-(--lightgray) last:border-none'
                          }
                        >
                          <p className={`text-xs md:text-sm`}>{row}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection
