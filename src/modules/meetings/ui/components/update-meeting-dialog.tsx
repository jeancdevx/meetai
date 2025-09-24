'use client'

import ResponsiveDialog from '@/components/responsive-dialog'

import { MeetingGetOne } from '../../types'
import MeetingForm from './meeting-form'

interface UpdateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: MeetingGetOne
}

const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title='Update Meeting'
      description='Update the meeting details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        initialValues={initialValues}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default UpdateMeetingDialog
