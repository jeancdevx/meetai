import { Suspense } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'

import { AgentIdView } from '@/modules/agents/ui/views'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

interface AgentIdPageProps {
  params: Promise<{ agentId: string }>
}

export default async function AgentIdPage({ params }: AgentIdPageProps) {
  const { agentId } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title='Loading Agent'
            description='This may take a moment'
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title='Failed to load agent'
              description='Please try again later'
            />
          }
        >
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
