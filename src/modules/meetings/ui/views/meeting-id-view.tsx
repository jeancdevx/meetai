'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useTRPC } from '@/trpc/client'
import { useConfirm } from '@/hooks/use-confirm'

import { MeetingIdViewHeader } from '../components/meeting-id-view-header'
import UpdateMeetingDialog from '../components/update-meeting-dialog'

interface MeetingIdViewProps {
  meetingId: string
}

const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const router = useRouter()

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false)

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are you sure you want to remove this meeting?',
    'The following action will remove the meeting and cannot be undone.'
  )

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  )

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onMutate: () => {
        toast.loading('Removing meeting...', { id: 'remove-meeting' })
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )
        // todo: invalidate free tier usage

        router.push('/meetings')

        toast.success('Meeting removed', { id: 'remove-meeting' })
      },
      onError: error => {
        toast.error(`Error removing meeting: ${error.message}`, {
          id: 'remove-meeting'
        })
      }
    })
  )

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove()

    if (!ok) return

    await removeMeeting.mutateAsync({ id: meetingId })
  }

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />

      <div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
        <MeetingIdViewHeader
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {JSON.stringify(data, null, 2)}
      </div>
    </>
  )
}

export default MeetingIdView
