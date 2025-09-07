import { Suspense } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'

import { AgentsView } from '@/modules/agents/ui/views'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

export default async function AgentsPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title='Loading Agents'
            description='This may take a moment'
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title='Failed to load agents'
              description='Please try again later'
            />
          }
        >
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
