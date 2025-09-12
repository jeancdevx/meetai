'use client'

import { useState } from 'react'

import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import NewMeetingDialog from './new-meeting-dialog'

const MeetingsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

        <div className='flex items-center gap-x-2 p-1'>todo: filters</div>
      </div>
    </>
  )
}

export { MeetingsListHeader }
