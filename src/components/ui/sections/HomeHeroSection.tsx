'use client'
import { content } from '@/content/homepage/data'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import { motion } from 'motion/react'
import HeaderAnimation from '@/components/ui/molecules/HeaderAnimation'

const HomeHeroSection = () => {
  return (
    <section className={'pt-8 pb-8 md:pb-13'}>
      <div className={'container'}>
        <div className={'flex justify-center flex-col gap-y-6 w-full'}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
            viewport={{ once: true }}
            className={'flex justify-center'}
          >
            <div className={'aspect-120/43 w-full'}>
              <HeaderAnimation />
            </div>
          </motion.div>
          <div className={'flex justify-center'}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
              className={'max-w-200 text-center'}
            >
              {content.hero.title}
            </motion.h1>
          </div>
          <div className={'flex justify-center'}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              viewport={{ once: true }}
              className={'max-w-155 text-center text-(--darkgray) font-geist'}
            >
              {content.hero.text}
            </motion.p>
          </div>
        </div>
        <div className={'flex justify-center mt-8'}>
          <div className={'flex flex-wrap justify-center gap-4'}>
            {content.hero.cta.map((cta, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                <Link href={cta.href}>
                  <Button variant={cta.variant}>{cta.text}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection
