'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

import { columns } from '@/modules/agents/ui/components/columns'
import { DataTable } from '@/modules/agents/ui/components/data-table'

import EmptyState from '@/components/empty-state'

const AgentsView = () => {
  const trpc = useTRPC()

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

  return (
    <div className='flex flex-col gap-y-4 px-4 pb-4 md:px-8'>
      <DataTable columns={columns} data={data} />

      {data.length === 0 && (
        <EmptyState
          title='Create your first agent'
          description='Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the meeting.'
        />
      )}
    </div>
  )
}

export { AgentsView }
