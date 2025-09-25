import Link from 'next/link'

import { BanIcon, VideoIcon } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import { Button } from '@/components/ui/button'

interface UpcomingStateProps {
  meetingId: string
  onCancelMeeting: () => void
  isCancelling: boolean
}

const UpcomingState = ({
  meetingId,
  onCancelMeeting,
  isCancelling
}: UpcomingStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
      <EmptyState
        title='Your meeting is scheduled!'
        description='Once you start this meeting, a summary will be generated here.'
        image='/upcoming.svg'
      />

      <div className='flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center'>
        <Button
          variant='secondary'
          className='w-full lg:w-auto'
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon className='size-4' />
          <span>Cancel Meeting</span>
        </Button>
        <Button asChild className='w-full lg:w-auto' disabled={isCancelling}>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className='size-4' />
            <span>Start Meeting</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export { UpcomingState }
