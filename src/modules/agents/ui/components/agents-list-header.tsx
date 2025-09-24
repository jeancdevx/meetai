'use client'

import { useState } from 'react'

import { PlusIcon, XCircleIcon } from 'lucide-react'

import { DEFAULT_PAGE } from '@/constants'

import { useAgentsFilters } from '@/hooks/use-agents-filters'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { AgentsSearchFilter } from './agents-search-filter'
import NewAgentDialog from './new-agent-dialog'

const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [filters, setFilters] = useAgentsFilters()

  const isAnyFilterApplied = !!filters.search

  const onClearFilters = () => {
    setFilters({ search: '', page: DEFAULT_PAGE })
  }

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='flex flex-col gap-y-4 p-4 md:px-8'>
        <div className='flex items-center justify-between'>
          <h5 className='text-2xl font-semibold'>My Agents</h5>

          <Button
            className='font-semibold'
            onClick={() => setIsDialogOpen(true)}
          >
            Create Agent <PlusIcon />
          </Button>
        </div>

        <ScrollArea>
          <div className='flex items-center gap-x-2 p-1'>
            <AgentsSearchFilter />
            {isAnyFilterApplied && (
              <Button variant='outline' size='sm' onClick={onClearFilters}>
                <XCircleIcon />
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

export { AgentsListHeader }
