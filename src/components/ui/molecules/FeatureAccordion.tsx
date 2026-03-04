'use client'
import React from 'react'

interface FeatureAccordionProps {
  feature: {
    title: string
    text: string
  }
  isOpen: boolean
  onToggle: () => void
}

const FeatureAccordion = ({ feature, isOpen, onToggle }: FeatureAccordionProps) => {
  return (
    <div
      className={`border-t first:border-none border-(--lightgray) py-4 flex flex-col ${isOpen ? 'self-start' : 'self-end'}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={'w-full text-left flex items-center justify-between gap-x-4'}
      >
        <h4 className={`font-medium transition-all ease-in-out duration-200 text-[20px]!`}>
          {feature.title}
        </h4>

        <div className={'relative w-2.5 h-2.5'}>
          <span
            className={'absolute top-1/2 -translate-y-1/2 inline-block bg-black w-2.5 h-px'}
          ></span>
          <span
            className={
              'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 inline-block transition-all duration-200 ease-out bg-black w-px ' +
              (isOpen ? 'h-0' : 'h-2.5')
            }
          ></span>
        </div>
      </button>

      <div
        className={
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
          (isOpen
            ? 'delay-300 grid-rows-[1fr] opacity-100 mt-4'
            : 'delay-0 grid-rows-[0fr] opacity-0 mt-0')
        }
      >
        <div className={'overflow-hidden'}>
          <p className={'text-(--darkgray) text-base leading-[1.5em]'}>{feature.text}</p>
        </div>
      </div>
    </div>
  )
}

export default FeatureAccordion
