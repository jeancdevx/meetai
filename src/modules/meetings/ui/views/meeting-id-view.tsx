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

import { ActiveState } from '../components/active-state'
import { CancelledState } from '../components/cancelled-state'
import { MeetingIdViewHeader } from '../components/meeting-id-view-header'
import { ProcessingState } from '../components/processing-state'
import { UpcomingState } from '../components/upcoming-state'
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

  const isActive = data.status === 'active'
  const isUpcoming = data.status === 'upcoming'
  const isCancelled = data.status === 'cancelled'
  const isCompleted = data.status === 'completed'
  const isProcessing = data.status === 'processing'

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
        {isCancelled && <CancelledState />}
        {isCompleted && <div>completed</div>}
        {isProcessing && <ProcessingState />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={handleRemoveMeeting}
            isCancelling={false} // todo: disable while removing
          />
        )}
        {isActive && <ActiveState meetingId={meetingId} />}
      </div>
    </>
  )
}

export default MeetingIdView
