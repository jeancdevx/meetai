'use client'

import { LoaderIcon } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { generateAvatarUri } from '@/lib/avatar'

import CallConnect from './call-connect'

interface CallProviderProps {
  meetingId: string
  meetingName: string
}

const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
  const { data, isPending } = authClient.useSession()

  if (!data || isPending) {
    return (
      <div className='from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial'>
        <LoaderIcon className='size-4 animate-spin text-white' />
      </div>
    )
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({
          seed: data.user.name,
          variant: 'botttsNeutral'
        })
      }
    />
  )
}

export default CallProvider
