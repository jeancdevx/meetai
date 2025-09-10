'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { VideoIcon } from 'lucide-react'

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { useTRPC } from '@/trpc/client'
import { useConfirm } from '@/hooks/use-confirm'

import { AgentIdViewHeader } from '@/components/agent-id-view-header'
import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'

import UpdateAgentDialog from '../components/update-agent-dialog'

interface AgentIdViewProps {
  agentId: string
}

const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const router = useRouter()

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  )

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onMutate: () => {
        toast.loading('Removing agent...', { id: 'remove-agent' })
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        )
        // todo: invalidate free tier usage

        router.push('/agents')

        toast.success('Agent removed', { id: 'remove-agent' })
      },
      onError: error => {
        toast.error(`Error removing agent: ${error.message}`, {
          id: 'remove-agent'
        })
      }
    })
  )

  const [RemoveConfirmationDialog, confirm] = useConfirm(
    'Are you sure you want to remove this agent?',
    `The following action will remove ${data.meetingCount > 0 ? 'all ' : ''}associated meetings and cannot be undone.`
  )

  const handleRemove = async () => {
    const ok = await confirm()

    if (!ok) return

    removeAgent.mutate({ id: agentId })
  }

  return (
    <>
      <RemoveConfirmationDialog />

      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />

      <div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemove}
        />

        <div className='rounded-lg border bg-white'>
          <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
            <div className='flex items-center gap-x-3'>
              <GeneratedAvatar
                variant='botttsNeutral'
                seed={data.name}
                className='size-10'
              />
              <h2 className='text-lg font-semibold capitalize'>{data.name}</h2>
            </div>

            <Badge
              variant='outline'
              className='flex items-center gap-x-2 font-semibold [&>svg]:size-4'
            >
              <VideoIcon className='text-blue-700' />
              {data.meetingCount}{' '}
              {data.meetingCount === 1 ? 'meeting' : 'meetings'}
            </Badge>

            <div className='flex flex-col gap-y-4'>
              <p className='text-lg font-semibold'>Instructions</p>
              <p className='text-sm text-neutral-700 capitalize'>
                {data.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { AgentIdView }
