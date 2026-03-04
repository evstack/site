import React from 'react'
import Link from 'next/dist/client/link'
import Image from 'next/image'
import Button from '@/components/ui/molecules/Button'
import { uiData } from '@/content/ui/data'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-center">
      <div className={'pt-8'}>
        <div className={'bg-black rounded-[70px] p-1.5 flex items-center gap-x-8 w-auto'}>
          <div className={'pl-4.5'}>
            <Link href={'/'}>
              <Image src={'evolve-logo.svg'} alt={'Evolve'} width={100} height={25} />
            </Link>
          </div>
          <div className={'flex items-center gap-x-5'}>
            {uiData.nav.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-white font-geist-mono text-[13px] uppercase leading-[1em] mb-0 hover:text-(--purple) transition-all ease-in-out duration-300"
              >
                {item.text}
              </Link>
            ))}
          </div>
          <div>
            <Link href={uiData.header.cta.href}>
              <Button variant={'secondary'}>{uiData.header.cta.text}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
