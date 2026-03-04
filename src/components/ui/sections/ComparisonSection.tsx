import { content } from '@/content/homepage/data'

const ComparisonSection = () => {
  return (
    <section className={'py-25'}>
      <div className={'container'}>
        <div className={'flex flex-col gap-y-2'}>
          <div className={''}>
            <h2 className={'text-center'}>{content.comparisonSection.subtitle}</h2>
          </div>
          <div className={''}>
            <h3 className={'text-center'}>{content.comparisonSection.title}</h3>
          </div>
          <div className={'pt-3 flex justify-center'}>
            <p className={'text-(--darkgray) text-sm leading-[1.57em] text-center max-w-167.5'}>
              {content.comparisonSection.text}
            </p>
          </div>
        </div>

        <div className={'w-full pt-12'}>
          <div className={'bg-diagonal rounded-xl p-4 border border-(--diagonal)'}>
            <div className={'w-full rounded-2xl bg-[#F3F4F4] border border-(--diagonal) p-1'}>
              <div
                className={'grid'}
                style={{
                  gridTemplateColumns: `repeat(${content.comparisonSection.datatable.columns.length}, 1fr)`
                }}
              >
                {content.comparisonSection.datatable.columns.map((column, index) => (
                  <div
                    key={index}
                    className={
                      'flex flex-col gap-y-2 font-normal text-(--darkgray) first:font-medium first:text-black last:font-semibold last:text-black'
                    }
                  >
                    <div className={'text-left'}>
                      <h4
                        className={
                          'text-[20px] font-semibold! font-inter text-black bg-white px-6 py-5 rounded-xl shadow-sm m-1 flex items-center gap-x-4'
                        }
                      >
                        {column.icon && <span>{column.icon}</span>}
                        <span>{column.title}</span>
                      </h4>
                      {column.rows.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className={
                            'flex items-center h-14 px-6 odd:bg-white/50 border-b border-(--lightgray) last:border-none'
                          }
                        >
                          <p className={`text-sm`}>{row}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection
