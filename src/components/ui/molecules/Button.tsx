import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps {
  children: React.ReactNode
  variant?: string
}

const buttonClassByVariant = (variant: string) => {
  switch (variant) {
    case 'primary':
      return 'bg-black text-white'
    case 'secondary':
      return 'bg-gray-200 text-gray-700'
    case 'outline':
      return 'bg-transparent ring ring-black text-black'
    default:
      return 'bg-gray-300 text-gray-700'
  }
}

const Button = ({ children, variant = 'primary' }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        buttonClassByVariant(variant),
        'text-[13px] font-medium uppercase text-center px-6 py-3 rounded-[70px] cursor-pointer font-geist-mono'
      )}
    >
      {children}
    </button>
  )
}

export default Button
