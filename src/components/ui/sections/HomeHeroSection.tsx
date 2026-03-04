import React from 'react'
import { content } from '@/content/homepage/data'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'
import Image from 'next/image'

const HomeHeroSection = () => {
  return (
    <section className={'pt-8 pb-13'}>
      <div className={'container'}>
        <div className={'flex justify-center flex-col gap-y-6'}>
          <div className={'flex justify-center'}>
            <Image src={'/header-image.png'} alt={'Evolve'} width={980} height={350} />
          </div>
          <div className={'flex justify-center'}>
            <h1 className={'max-w-200 text-center'}>{content.hero.title}</h1>
          </div>
          <div className={'flex justify-center'}>
            <p className={'max-w-155 text-center text-(--darkgray) font-geist'}>
              {content.hero.text}
            </p>
          </div>
        </div>
        <div className={'flex justify-center mt-8'}>
          <div className={'flex justify-between gap-x-4'}>
            {content.hero.cta.map((cta, index) => (
              <div key={index}>
                <Link href={cta.href}>
                  <Button variant={cta.variant}>{cta.text}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection
