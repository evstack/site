'use client'
import { content } from '@/content/homepage/data'
import Image from 'next/image'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import { motion } from 'motion/react'

const EcosystemSection = () => {
  return (
    <section className={'max-lg:px-0! lg:px-4!'}>
      <div
        className={
          'w-full lg:rounded-2xl bg-diagonal-black pt-12 lg:pt-25 pb-8 flex justify-center xl:mb-4 px-4 lg:px-8 xl:px-0'
        }
      >
        <div className={'container'}>
          <div className={'grid grid-cols-1 lg:grid-cols-2 gap-2'}>
            <div
              className={
                'rounded-3xl bg-[#101010] p-6 max-lg:pt-12 lg:p-12 flex flex-wrap justify-center'
              }
            >
              <div>
                <div className={'grid grid-cols-1 gap-1'}>
                  <div className={''}>
                    <motion.h2
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
                      viewport={{ once: true }}
                      className={'text-center text-(--smoke)'}
                    >
                      {content.ecosytemSection.subtitle}
                    </motion.h2>
                  </div>
                  <div className={''}>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      viewport={{ once: true }}
                      className={'text-center text-white'}
                    >
                      {content.ecosytemSection.title}
                    </motion.h3>
                  </div>
                  <div className={'pt-1 flex justify-center'}>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
                      viewport={{ once: true }}
                      className={'text-[#C8C8C8] text-sm leading-[1.5em] text-center'}
                    >
                      {content.ecosytemSection.text}
                    </motion.p>
                  </div>
                </div>
                <div className={'pt-10'}>
                  <div className={'border border-dashed border-[#303030] rounded-2xl'}>
                    {content.ecosytemSection.rows.map((row: any, index: number) => (
                      <div
                        key={index}
                        className={
                          'grid grid-cols-12 items-center divide-x divide-dashed divide-[#303030]'
                        }
                      >
                        <p
                          className={
                            'col-span-4 text-white text-base font-semibold tracking-[-0.04em] pl-4 lg:pl-8 py-4.5'
                          }
                        >
                          {row.title}
                        </p>
                        <p className={'col-span-8 text-[#C8C8C8] text-sm pl-4 lg:pl-8'}>
                          {row.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={'self-end mt-6 lg:mt-0'}>
                <div className={'flex flex-wrap gap-4 self-end'}>
                  {content.ecosytemSection.cta.map((cta, index) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                      key={index}
                      className={'text-white'}
                    >
                      <Link href={cta.href}>
                        <div className={'flex items-center gap-2'}>
                          <span className={'font-geist-mono text-[13px] font-medium uppercase'}>
                            {cta.text}
                          </span>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="24" height="24" rx="12" fill="#1E1E1E" />
                            <path
                              d="M14.669 10.2722L8.94118 16L8 15.0588L13.7278 9.33103H8.67937V8H16V15.3206H14.669V10.2722Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className={'rounded-3xl bg-[#101010] p-6 lg:p-12 xl:p-8'}>
              <div className={'flex flex-wrap gap-y-4'}>
                <div className={'w-full flex justify-center pt-8 lg:pt-13'}>
                  <Image src={'evolve-logo.svg'} alt={'Evolve'} width={154} height={38} />
                </div>
                <div className={'w-full pt-6'}>
                  <h3
                    className={
                      'text-[32px]! lg:text-[48px]! font-semibold! leading-[1.04em]! tracking-[-0.04em]! bg-linear-to-r from-(--purple) via-(--blue) to-(--yellow) text-transparent bg-clip-text bg-300% animate-gradient text-center'
                    }
                  >
                    {content.ecosytemSection.deploy.title}
                  </h3>
                </div>
                <div className={'w-full'}>
                  <p
                    className={
                      'text-base lg:text-[18px] text-[#c8c8c8] leading-[1.22em] tracking-[-0.02em] font-medium text-center'
                    }
                  >
                    {content.ecosytemSection.deploy.text}
                  </p>
                </div>
                <div className={'w-full flex justify-center'}>
                  <Link href={content.ecosytemSection.deploy.cta.href}>
                    <Button variant={'secondary'}>{content.ecosytemSection.deploy.cta.text}</Button>
                  </Link>
                </div>

                <div
                  className={
                    'w-full justify-center flex flex-wrap gap-x-4 gap-y-4 lg:gap-x-8 mt-10 lg:mt-20'
                  }
                >
                  {content.ecosytemSection.deploy.socials.map((social, index) => (
                    <a key={index} href={social.href} target="_blank">
                      <div className={'flex gap-x-2 lg:gap-x-3 text-white items-center'}>
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 0.5, type: 'spring', delay: 0.2 + index * 0.1 }}
                          viewport={{ once: true }}
                          className={
                            'w-10 h-10 bg-[#1e1e1e] rounded-full items-center justify-center flex'
                          }
                        >
                          {social.icon}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            ease: 'easeInOut',
                            delay: 0.2 + index * 0.1
                          }}
                          viewport={{ once: true }}
                          className={'text-sm font-geist-mono font-medium uppercase'}
                        >
                          {social.text}
                        </motion.div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={'w-full text-[#C8C8C8] text-sm py-4'}>
            <div className={'flex flex-wrap justify-between max-lg:text-center'}>
              <div className={'w-full lg:w-auto'}>
                <div className={'flex flex-wrap gap-x-6'}>
                  <div className={'w-full lg:w-auto'}>
                    <p>{content.ecosytemSection.copyright}</p>
                  </div>
                  <div className={'w-full lg:w-auto'}>
                    {content.ecosytemSection.links.map((link, index) => (
                      <a key={index} href={link.href} target="_blank">
                        {index !== 0 && <span className={'px-2'}>·</span>}
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className={'w-full lg:w-auto pt-4 lg:pt-0'}>
                Created by{' '}
                <a href="https://www.designatives.com" target="_blank">
                  Designatives
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EcosystemSection
