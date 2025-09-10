'use client'

import { VideoIcon } from 'lucide-react'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

import { AgentIdViewHeader } from '@/components/agent-id-view-header'
import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'

interface AgentIdViewProps {
  agentId: string
}

const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  )

  return (
    <div className='flex flex-1 flex-col gap-y-4 p-4 md:px-8'>
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {
          // TODO: Implement edit agent functionality
        }}
        onRemove={() => {
          // TODO: Implement remove agent functionality
        }}
      />

      <div className='rounded-lg border bg-white'>
        <div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
          <div className='flex items-center gap-x-3'>
            <GeneratedAvatar
              variant='botttsNeutral'
              seed={data.name}
              className='size-10'
            />
            <h2 className='text-lg font-semibold'>{data.name}</h2>
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
            <p className='text-sm text-neutral-700'>{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AgentIdView }
