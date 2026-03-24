import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import Image from 'next/image'

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.2l-1.83 8.64c-.14.62-.5.77-.99.48l-2.75-2.03-1.33 1.28c-.15.15-.27.27-.55.27l.2-2.79 5.07-4.58c.22-.2-.05-.3-.34-.12l-6.27 3.95-2.7-.84c-.59-.18-.6-.59.12-.87l10.56-4.07c.49-.18.92.12.81.68z" />
  </svg>
)

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Image src="/evolve-logo-dark.svg" alt="Evolve" width={100} height={24} />
    },
    themeSwitch: { enabled: false },
    githubUrl: 'https://github.com/evstack',
    links: [
      {
        type: 'icon',
        text: 'Twitter',
        label: 'Twitter',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
        url: 'https://twitter.com/ev_stack',
        external: true
      },
      {
        type: 'icon',
        text: 'Telegram',
        label: 'Telegram',
        icon: <TelegramIcon />,
        url: 'https://t.me/+2p8-IYf6sQ0zNmEx',
        external: true
      }
    ]
  }
}
