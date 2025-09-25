import Link from 'next/link'

import { VideoIcon } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import { Button } from '@/components/ui/button'

interface ActiveStateProps {
  meetingId: string
}

const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
      <EmptyState
        title='Your meeting is active!'
        description='Meeting will end once all participants leave.'
        image='/upcoming.svg'
      />

      <div className='flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center'>
        <Button asChild className='w-full lg:w-auto'>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className='size-4' />
            <span>Join Meeting</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export { ActiveState }
