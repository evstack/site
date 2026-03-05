import { twMerge } from 'tailwind-merge'

interface BadgeProps {
  children: React.ReactNode
  variant?: string
}

const badgeClassByVariant = (variant: string) => {
  switch (variant) {
    case 'primary':
    default:
      return 'border-(--pink)/24 bg-(--pink)/10 text-(--pink)'
    case 'secondary':
      return 'border-(--yellow)/24 bg-(--yellow)/10 text-(--yellow)'
    case 'tertiary':
      return 'border-(--blue)/24 bg-(--blue)/10 text-(--blue)'
  }
}
const Badge = ({ children, variant = 'primary' }: BadgeProps) => {
  return (
    <div
      className={twMerge(
        'p-2 rounded-3xl shrink-0 border font-geist-mono text-xs md:text-sm',
        badgeClassByVariant(variant)
      )}
    >
      {children}
    </div>
  )
}

export default Badge
