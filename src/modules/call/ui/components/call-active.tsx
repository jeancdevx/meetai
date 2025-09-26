import Image from 'next/image'
import Link from 'next/link'

import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk'

interface CallActiveProps {
  onLeave: () => void
  meetingName: string
}

const CallActive = ({ onLeave, meetingName }: CallActiveProps) => {
  return (
    <div className='flex h-full flex-col justify-between p-4 text-white'>
      <div className='flex items-center gap-4 rounded-full bg-[#101213] p-4'>
        <Link
          href='/'
          className='flex w-fit items-center justify-center rounded-full bg-white/10 p-1'
        >
          <Image
            src='/logo.svg'
            alt='MeetAI Logo'
            width={22}
            height={22}
            className='rounded-full'
          />
        </Link>
        <h4 className='text-base font-bold capitalize'>{meetingName}</h4>
      </div>

      <SpeakerLayout />

      <div className='rounded-full bg-[#101213] p-4'>
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  )
}

export { CallActive }
