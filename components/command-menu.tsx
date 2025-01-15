'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { CommandIcon, Home, User, FileText, Clock, Book, Briefcase, Mic, Mail, DollarSign, Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'

type CommandItem = {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  action: () => void;
};

export function CommandMenu() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [currentTime, setCurrentTime] = React.useState(new Date())
  const router = useRouter()
  const commandMenuRef = React.useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  const closeMenu = () => setIsOpen(false)

  const items: { [key: string]: CommandItem[] } = {
    Pages: [
      { icon: Home, label: 'Home', action: () => router.push('/') },
      { icon: User, label: 'About', action: () => router.push('/about') },
      { icon: FileText, label: 'Index', action: () => router.push('/blog') },
      { icon: Mic, label: 'Talks', action: () => router.push('/talks') },
      { icon: Mail, label: 'Contact', action: () => router.push('/contact') },
      { icon: DollarSign, label: 'Donate', action: () => router.push('/donate') },
    ],
    Info: [
      { icon: Book, label: 'Notes', action: () => router.push('/notes') },
      { icon: Clock, label: 'Now', action: () => router.push('/now') },
      { icon: Briefcase, label: 'Work', action: () => router.push('/work') },
      { icon: FileText, label: 'Lecture Notes', action: () => router.push('/lecture-notes') },
    ],
  };

  const filteredItems = Object.entries(items).reduce((acc, [category, categoryItems]) => {
    const filtered = categoryItems.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as typeof items);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandMenuRef.current && !commandMenuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Chicago'
  })

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
      >
        <CommandIcon className="h-4 w-4" />
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={commandMenuRef}
          className="relative w-full max-w-lg rounded-lg border bg-background shadow-xl"
        >
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Chicago,</span>
              <time>{formattedTime}</time>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-secondary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-2 text-sm outline-none border-b placeholder:text-muted-foreground focus:border-primary transition-colors"
            aria-label="Search commands"
          />
          <ul className="max-h-[300px] overflow-y-auto p-2">
            {Object.entries(filteredItems).map(([category, categoryItems]) => (
              <li key={category} className="mb-4">
                <h2 className="px-2 text-xs font-semibold text-muted-foreground mb-2">{category}</h2>
                <ul>
                  {categoryItems.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => {
                          item.action()
                          closeMenu()
                        }}
                        className="flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-secondary"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

