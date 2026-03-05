'use client'
import { content } from '@/content/homepage/data'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { motion } from 'motion/react'

const LogoSection = () => {
  return (
    <section className={'py-8 md:py-13'}>
      <div className={'container'}>
        <div className={'w-full flex justify-center'}>
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              viewport={{ once: true }}
              className={'text-xs! max-lg:text-center max-w-100'}
            >
              {content.logoSection.title}
            </motion.h2>
          </div>
        </div>
      </div>
      <div className={'w-full pt-8 overflow-hidden'}>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Marquee
            autoFill={true}
            pauseOnHover={true}
            speed={100}
            loop={0}
            gradient={true}
            gradientColor={'#F3F4F4'}
            className={'flex gap-x-8'}
          >
            {content.logoSection.logos.map((logo, index) => (
              <div key={index}>
                {logo.src && (
                  <div className={'h-13 w-20 md:w-32 lg:w-40'}>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={300}
                      height={300}
                      className={'max-h-full max-w-full object-contain'}
                    />
                  </div>
                )}
              </div>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  )
}

export default LogoSection
