'use client'

import { Dispatch, SetStateAction } from 'react'

import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog
} from '@/components/ui/command'

interface DashboardCommandProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Find a meeting or an agent...' />

      <CommandList>
        <CommandItem>Example Item 1</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  )
}

export { DashboardCommand }
