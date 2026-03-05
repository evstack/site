'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { motion } from 'motion/react'

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
    <motion.button
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      viewport={{ once: true }}
      className={twMerge(
        buttonClassByVariant(variant),
        'text-[13px] font-medium uppercase text-center px-6 py-3 rounded-[70px] cursor-pointer font-geist-mono group will-change-transform inset-1 transition-all ease-in-out duration-300 hover:ring-2'
      )}
    >
      <div
        className={
          'transition-all ease-in-out duration-300 scale-100 group-hover:scale-105 will-change-transform transform-gpu '
        }
      >
        {children}
      </div>
    </motion.button>
  )
}

export default Button
