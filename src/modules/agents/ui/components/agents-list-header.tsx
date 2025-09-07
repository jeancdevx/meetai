'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import NewAgentDialog from './new-agent-dialog'

const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      </div>
    </>
  )
}

export { AgentsListHeader }
