'use client'
import Button from '@/components/ui/molecules/Button'
import { uiData } from '@/content/ui/data'
import { motion } from 'motion/react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        viewport={{ once: true }}
        className={'pt-8'}>
        <div className={'bg-black rounded-[70px] p-1.5 flex items-center gap-x-8 w-auto'}>
          <div className={'pl-4.5'}>
            <a href={'/'}>
              <img src={'/evolve-logo.svg'} alt={'Evolve'} width={100} height={25} />
            </a>
          </div>
          <div className={'items-center gap-x-5 hidden md:flex'}>
            {uiData.nav.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white font-geist-mono text-[13px] uppercase leading-[1em] mb-0 hover:text-(--purple) transition-all ease-in-out duration-300">
                {item.text}
              </a>
            ))}
          </div>
          <div>
            <a href={uiData.header.cta.href}>
              <Button variant={'secondary'}>{uiData.header.cta.text}</Button>
            </a>
          </div>
        </div>
      </motion.div>
    </header>
  )
}

export default Header
