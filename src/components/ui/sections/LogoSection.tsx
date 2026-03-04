import { content } from '@/content/homepage/data'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'

const LogoSection = () => {
  return (
    <section className={'py-13'}>
      <div className={'container'}>
        <div className={'w-full flex justify-center'}>
          <div>
            <h2 className={'text-xs!'}>{content.logoSection.title}</h2>
          </div>
        </div>
      </div>
      <div className={'w-full pt-8'}>
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
                <div className={'h-13'}>
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
      </div>
    </section>
  )
}

export default LogoSection
