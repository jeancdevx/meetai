'use client'

import ResponsiveDialog from '@/components/responsive-dialog'

import { AgentGetOne } from '../../types'
import AgentForm from './agent-form'

interface UpdateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: AgentGetOne
}

const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title='Update Agent'
      description='Update the AI agent details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        initialValues={initialValues}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  )
}

export default UpdateAgentDialog
