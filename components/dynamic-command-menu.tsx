'use client'

import dynamic from 'next/dynamic'

const DynamicCommandMenu = dynamic(() => import('./command-menu').then((mod) => mod.CommandMenu), {
  ssr: false,
})

export { DynamicCommandMenu }

