import Link from 'next/link'

import { LogInIcon } from 'lucide-react'

import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview
} from '@stream-io/video-react-sdk'

import { authClient } from '@/lib/auth-client'
import { generateAvatarUri } from '@/lib/avatar'

import { Button } from '@/components/ui/button'

import '@stream-io/video-react-sdk/dist/css/styles.css'

interface CallLobbyProps {
  onJoin: () => void
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession()

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? '',
          image:
            data?.user.image ??
            generateAvatarUri({
              seed: data?.user.name ?? '',
              variant: 'initials'
            })
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermissions = () => {
  return (
    <p className='text-sm'>
      Please grant your browser permission to access your microphone and camera.
    </p>
  )
}

const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks()

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState()
  const { hasBrowserPermission: hasCameraPermission } = useCameraState()

  const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission

  return (
    <div className='from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial'>
      <div className='flex flex-1/2 items-center justify-center px-8 py-4'>
        <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
          <div className='flex flex-col gap-y-2 text-center'>
            <h2 className='text-2xl font-semibold'>Ready to join?</h2>
            <p className='text-muted-foreground text-sm'>
              Set up your call before joining.
            </p>
          </div>

          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />

          <div className='flex gap-x-2'>
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          <div className='flex w-full justify-between gap-x-2'>
            <Button asChild variant='ghost'>
              <Link href='/meetings'>Cancel</Link>
            </Button>
            <Button disabled={!hasBrowserMediaPermission} onClick={onJoin}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CallLobby }
