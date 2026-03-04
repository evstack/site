import { content } from '@/content/homepage/data'
import Image from 'next/image'
import Link from 'next/dist/client/link'
import Button from '@/components/ui/molecules/Button'

const EcosystemSection = () => {
  return (
    <section>
      <div className={'w-full rounded-2xl bg-diagonal-black pt-25 pb-8 flex justify-center mb-4'}>
        <div className={'container'}>
          <div className={'grid grid-cols-2 gap-2'}>
            <div className={'rounded-3xl bg-[#101010] p-12 flex flex-wrap'}>
              <div>
                <div className={'grid grid-cols-1 gap-1'}>
                  <div className={''}>
                    <h2 className={'text-center text-(--smoke)'}>
                      {content.ecosytemSection.subtitle}
                    </h2>
                  </div>
                  <div className={''}>
                    <h3 className={'text-center text-white'}>{content.ecosytemSection.title}</h3>
                  </div>
                  <div className={'pt-1 flex justify-center'}>
                    <p className={'text-[#C8C8C8] text-sm leading-[1.5em] text-center'}>
                      {content.ecosytemSection.text}
                    </p>
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
                            'col-span-4 text-white text-base font-semibold tracking-[-0.04em] pl-8 py-4.5'
                          }
                        >
                          {row.title}
                        </p>
                        <p className={'col-span-8 text-[#C8C8C8] text-sm pl-8'}>{row.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={'self-end'}>
                <div className={'flex flex-wrap gap-8 self-end'}>
                  {content.ecosytemSection.cta.map((cta, index) => (
                    <div key={index} className={'text-white'}>
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={'rounded-3xl bg-[#101010] p-12'}>
              <div className={'flex flex-wrap gap-y-4'}>
                <div className={'w-full flex justify-center pt-13'}>
                  <Image src={'evolve-logo.svg'} alt={'Evolve'} width={154} height={38} />
                </div>
                <div className={'w-full pt-6'}>
                  <h3
                    className={
                      'text-[48px]! font-semibold! leading-[1.04em]! tracking-[-0.04em]! text-gradient text-center'
                    }
                  >
                    {content.ecosytemSection.deploy.title}
                  </h3>
                </div>
                <div className={'w-full'}>
                  <p
                    className={
                      'text-[18px] text-[#c8c8c8] leading-[1.22em] tracking-[-0.02em] font-medium text-center'
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

                <div className={'w-full justify-center flex gap-x-8 mt-20'}>
                  {content.ecosytemSection.deploy.socials.map((social, index) => (
                    <a key={index} href={social.href} target="_blank">
                      <div className={'flex gap-x-3 text-white items-center'}>
                        <div
                          className={
                            'w-10 h-10 bg-[#1e1e1e] rounded-full items-center justify-center flex'
                          }
                        >
                          {social.icon}
                        </div>
                        <div className={'text-sm font-geist-mono font-medium uppercase'}>
                          {social.text}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={'w-full text-[#C8C8C8] text-sm py-4'}>
            <div className={'flex justify-between'}>
              <div>
                <div className={'flex gap-x-6'}>
                  <div>
                    <p>{content.ecosytemSection.copyright}</p>
                  </div>
                  <div>
                    {content.ecosytemSection.links.map((link, index) => (
                      <a key={index} href={link.href} target="_blank">
                        {index !== 0 && <span className={'px-2'}>·</span>}
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div>
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
