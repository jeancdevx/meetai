'use client'

import { useEffect, useState } from 'react'

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'

import { usePlatform } from '@/hooks/use-platform'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

import DashboardCommand from './dashboard-command'

const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const { getShortcut } = usePlatform()

  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [])

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav className='bg-background flex items-center gap-x-2 border-b px-4 py-3'>
        <Button className='size-9' variant='outline' onClick={toggleSidebar}>
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon className='size-4' />
          ) : (
            <PanelLeftCloseIcon className='size-4' />
          )}
        </Button>

        <Button
          variant='outline'
          size='sm'
          className='text-muted-foreground hover:text-muted-foreground h-9 w-[240px] justify-start font-normal'
          onClick={() => setCommandOpen(open => !open)}
        >
          <SearchIcon className='mr-1 size-4' />
          Search...
          <kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-semibold select-none'>
            <span className='text-xs'>{getShortcut('K')}</span>
          </kbd>
        </Button>
      </nav>
    </>
  )
}

export { DashboardNavbar }
