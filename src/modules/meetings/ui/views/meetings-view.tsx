'use client'

import { useRouter } from 'next/navigation'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { useMeetingsFilters } from '@/hooks/use-meetings-filters'

import { DataPagination } from '@/components/data-pagination'
import { DataTable } from '@/components/data-table'
import EmptyState from '@/components/empty-state'

import { columns } from '../components/columns'

const MeetingsView = () => {
  const router = useRouter()

  const [filters, setFilter] = useMeetingsFilters()

  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters
    })
  )

  return (
    <div className='flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8'>
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={row => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={page => setFilter({ page })}
      />

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
