import { useState } from 'react'

import { StreamTheme, useCall } from '@stream-io/video-react-sdk'

import { CallActive } from './call-active'
import { CallEnded } from './call-ended'
import { CallLobby } from './call-lobby'

interface CallUIProps {
  meetingName: string
}

const CallUI = ({ meetingName }: CallUIProps) => {
  const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby')

  const call = useCall()

  const handleJoin = async () => {
    if (!call) return

    await call.join()

    setShow('call')
  }

  const handleLeave = () => {
    if (!call) return

    call.endCall()

    setShow('ended')
  }

  return (
    <StreamTheme className='h-full'>
      {show === 'lobby' && <CallLobby onJoin={handleJoin} />}
      {show === 'call' && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show === 'ended' && <CallEnded />}
    </StreamTheme>
  )
}

export { CallUI }
