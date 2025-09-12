'use client'

import { useRouter } from 'next/navigation'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { useAgentsFilters } from '@/hooks/use-agents-filters'

import { columns } from '@/modules/agents/ui/components/columns'
import DataPagination from '@/modules/agents/ui/components/data-pagination'

import { DataTable } from '@/components/data-table'
import EmptyState from '@/components/empty-state'

const AgentsView = () => {
  const router = useRouter()

  const [filters, setFilters] = useAgentsFilters()

  const trpc = useTRPC()
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters
    })
  )

  return (
    <div className='flex flex-col gap-y-4 px-4 pb-4 md:px-8'>
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={row => router.push(`/agents/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={page => setFilters({ page })}
      />

      {data.items.length === 0 && (
        <EmptyState
          title='Create your first agent'
          description='Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the meeting.'
        />
      )}
    </div>
  )
}

export { AgentsView }
