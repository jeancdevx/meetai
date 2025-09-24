'use client'

import { useState } from 'react'

import { PlusIcon, XCircleIcon } from 'lucide-react'

import { DEFAULT_PAGE } from '@/constants'

import { useMeetingsFilters } from '@/hooks/use-meetings-filters'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { AgentIdFilter } from './agent-id-filter'
import { MeetingsSearchFilter } from './meetings-search-filter'
import NewMeetingDialog from './new-meeting-dialog'
import { StatusFilter } from './status-filter'

const MeetingsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [filters, setFilters] = useMeetingsFilters()

  const isAnyFilterApplied = !!(
    filters.agentId ||
    filters.status ||
    filters.search
  )

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: '',
      search: '',
      page: DEFAULT_PAGE
    })
  }

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='flex flex-col gap-y-4 p-4 md:px-8'>
        <div className='flex items-center justify-between'>
          <h5 className='text-2xl font-semibold'>My Meetings</h5>

          <Button
            className='font-semibold'
            onClick={() => setIsDialogOpen(true)}
          >
            New Meeting <PlusIcon />
          </Button>
        </div>

        <ScrollArea>
          <div className='flex items-center gap-x-2 p-1'>
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isAnyFilterApplied && (
              <Button variant='outline' size='sm' onClick={onClearFilters}>
                <XCircleIcon className='size-4' />
                Clear
              </Button>
            )}
          </div>

          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </>
  )
}

export { MeetingsListHeader }
