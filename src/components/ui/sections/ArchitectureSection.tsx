'use client'
import { content } from '@/content/homepage/data'
import Badge from '@/components/ui/atoms/Badge'
import Layers from '@/components/ui/organisms/Layers'
import { motion } from 'motion/react'

const CodeBlock = ({ code }: { code: any }) => {
  return (
    <div className={'relative flex flex-wrap gap-y-4 md:gap-y-7.5'}>
      <div
        className={
          'grid grid-cols-1 gap-2 p-8 bg-[#101010] border border-[#252525] rounded-2xl md:flex-none'
        }
      >
        <div className={'text-(--darksmoke) text-sm leading-[1.5em]'}>{code.text}</div>
        <div className={'flex flex-wrap gap-2 items-center'}>
          {code.badge && <Badge>{code.badge}</Badge>}
          <div className={'text-white text-xs md:text-sm leading-[1.5em] font-geist-mono'}>
            {code.code}
          </div>
        </div>
      </div>
      {code.child && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          viewport={{ once: true }}
          className={'relative md:pl-8'}
        >
          <svg
            className={'absolute left-5 -top-3.5 md:-top-7'}
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="67"
            viewBox="0 0 17 67"
            fill="none"
          >
            <path
              d="M0.5 0C0.5 31.9143 0.5 49.2224 0.5 58.0035C0.5 62.4218 4.08172 66 8.5 66H16.5"
              stroke="white"
            />
          </svg>
          <CodeBlock code={code.child} />
        </motion.div>
      )}
    </div>
  )
}

const ArchitectureSection = () => {
  return (
    <section id={'architecture'} className={'bg-black py-13 lg:py-25 overflow-hidden'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2'}>
          <div className={'text-center'}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              viewport={{ once: true }}
              className={'text-(--smoke)'}
            >
              {content.architectureSection.subtitle}
            </motion.h2>
          </div>
          <div className={'text-center'}>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              viewport={{ once: true }}
              className={'text-white'}
            >
              {content.architectureSection.title}
            </motion.h3>
          </div>
        </div>

        <div
          className={
            'flex flex-wrap xl:flex-nowrap max-xl:justify-center gap-x-25 mt-12 items-center w-full'
          }
        >
          <div className={'w-full lg:w-5/12'}>
            <Layers />
          </div>
          <div className={'w-full lg:w-7/12'}>
            <div className={'w-full max-md:py-4 max-lg:py-12 lg:p-8 bg-diagonal-black px-12'}>
              <CodeBlock code={content.architectureSection.codeblocks} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
