import React, { Fragment } from 'react'
import { content } from '@/content/homepage/data'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import Image from 'next/image'

const UseCasesSection = () => {
  return (
    <section className={'py-25'}>
      <div className={'container'}>
        <div className={'grid grid-cols-24'}>
          <div className={'col-span-8'}>
            <div className={'flex flex-wrap h-full'}>
              <div className={'flex flex-col gap-y-2'}>
                <div className={'text-left'}>
                  <h2 className={''}>{content.useCasesSection.subtitle}</h2>
                </div>
                <div className={'text-left'}>
                  <h3 className={''}>{content.useCasesSection.title}</h3>
                </div>
                <div className={'pt-6'}>
                  <Link href={content.useCasesSection.cta.href}>
                    <Button>{content.useCasesSection.cta.text}</Button>
                  </Link>
                </div>
              </div>
              <div className={'self-end'}>
                <div className={'flex gap-x-8'}>
                  {content.useCasesSection.stats.map((stat, index) => (
                    <div key={index} className={'flex flex-col flex-wrap gap-y-2'}>
                      <div className={'mb-6'}>{stat.icon}</div>
                      <div className={'text-[56px] font-medium tracking-[-0.08em] leading-[0.9em]'}>
                        {stat.text}
                      </div>
                      <div
                        className={
                          'text-sm font-geist-mono font-medium uppercase text-(--darkgray)'
                        }
                      >
                        {stat.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={'col-[11/span_14]'}>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-1'}>
              <div>
                {content.useCasesSection.boxes
                  .filter((_, index) => index % 2 === 0)
                  .map((box, index) => (
                    <Fragment key={index}>
                      <div className={'w-full rounded-2xl bg-diagonal aspect-39/10'} />
                      <div className={'p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap'}>
                        <div className={'flex items-center justify-center mx-auto'}>
                          {box.animation && (
                            <Image
                              src={box.animation}
                              alt={box.title}
                              width={400}
                              height={400}
                              className={'max-h-37.5 w-auto'}
                            />
                          )}
                        </div>
                        <div className={'self-end'}>
                          <h4 className={'mb-2'}>{box.title}</h4>
                          <p className={'text-sm text-(--darkgray) leading-[1.71em]'}>{box.text}</p>
                        </div>
                      </div>
                    </Fragment>
                  ))}
              </div>
              <div>
                {content.useCasesSection.boxes
                  .filter((_, index) => index % 2 === 1)
                  .map((box, index) => (
                    <Fragment key={index}>
                      <div className={'p-8 bg-white rounded-2xl h-100 w-full flex flex-wrap'}>
                        <div className={'flex items-center justify-center mx-auto'}>
                          {box.animation && (
                            <Image
                              src={box.animation}
                              alt={box.title}
                              width={400}
                              height={400}
                              className={'max-h-37.5 w-auto'}
                            />
                          )}
                        </div>
                        <div className={'self-end'}>
                          <h4 className={'mb-2'}>{box.title}</h4>
                          <p className={'text-sm text-(--darkgray) leading-[1.71em]'}>{box.text}</p>
                        </div>
                      </div>
                      <div className={'w-full rounded-2xl bg-diagonal aspect-39/10'} />
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
