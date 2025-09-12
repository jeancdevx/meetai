'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

import { DataTable } from '@/components/data-table'
import EmptyState from '@/components/empty-state'

import { columns } from '../components/columns'

const MeetingsView = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <div className='flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8'>
      <DataTable data={data.items} columns={columns} />

      {data.items.length === 0 && (
        <EmptyState
          title='Create your first meeting'
          description='Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with your AI agents in real-time.'
        />
      )}
    </div>
  )
}

export { MeetingsView }
