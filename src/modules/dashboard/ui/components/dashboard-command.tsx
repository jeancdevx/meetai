'use client'

import { Dispatch, SetStateAction, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

import { GeneratedAvatar } from '@/components/generated-avatar'
import {
  CommandEmpty,
  CommandGroup,
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
  const router = useRouter()

  const [search, setSearch] = useState('')

  const trpc = useTRPC()

  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: 100
    })
  )
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: 100
    })
  )

  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder='Find a meeting or an agent...'
        value={search}
        onValueChange={setSearch}
      />

      <CommandList>
        <CommandGroup heading='Meetings'>
          <CommandEmpty>
            <span className='text-muted-foreground text-sm'>
              No meetings found
            </span>
          </CommandEmpty>
          {meetings.data?.items.map(meeting => (
            <CommandItem
              key={meeting.id}
              onSelect={() => {
                router.push(`/meetings/${meeting.id}`)
                setOpen(false)
              }}
            >
              <span className='capitalize'>{meeting.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading='Agents'>
          <CommandEmpty>
            <span className='text-muted-foreground text-sm'>
              No agents found
            </span>
          </CommandEmpty>
          {agents.data?.items.map(agent => (
            <CommandItem
              key={agent.id}
              onSelect={() => {
                router.push(`/agents/${agent.id}`)
                setOpen(false)
              }}
            >
              <GeneratedAvatar
                seed={agent.name}
                variant='botttsNeutral'
                className='size-6'
              />
              <span className='capitalize'>{agent.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  )
}

export { DashboardCommand }
