import { content } from '@/content/homepage/data'
import Badge from '@/components/ui/atoms/Badge'
import Layers from '@/components/ui/organisms/Layers'

const CodeBlock = ({ code }: { code: any }) => {
  return (
    <div className={'relative flex flex-wrap gap-y-7.5'}>
      <div
        className={
          'grid grid-cols-1 gap-y-2 p-8 bg-[#101010] border border-[#252525] rounded-2xl flex-none'
        }
      >
        <div className={'text-(--darksmoke) text-sm leading-[1.5em]'}>{code.text}</div>
        <div className={'flex gap-x-2 items-center'}>
          {code.badge && <Badge>{code.badge}</Badge>}
          <div className={'text-white text-sm leading-[1.5em] font-geist-mono'}>{code.code}</div>
        </div>
      </div>
      {code.child && (
        <div className={'relative pl-8'}>
          <svg
            className={'absolute left-5 -top-7'}
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
        </div>
      )}
    </div>
  )
}

const ArchitectureSection = () => {
  return (
    <section className={'bg-black py-25'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2'}>
          <div className={'text-center'}>
            <h2 className={'text-(--smoke)'}>{content.architectureSection.subtitle}</h2>
          </div>
          <div className={'text-center'}>
            <h3 className={'text-white'}>{content.architectureSection.title}</h3>
          </div>
        </div>

        <div className={'flex gap-x-25 mt-12 items-center'}>
          <div className={'w-6/12'}>
            <Layers />
          </div>
          <div className={'w-6/12'}>
            <div className={'w-full p-8 bg-diagonal-black'}>
              <CodeBlock code={content.architectureSection.codeblocks} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
