import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { SearchParams } from 'nuqs'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'

import { loadSearchParams } from '@/modules/agents/params'
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header'
import { AgentsView } from '@/modules/agents/ui/views'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

interface AgentsPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const filters = await loadSearchParams(await searchParams)

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/sign-in')

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({
      ...filters
    })
  )

  return (
    <>
      <AgentsListHeader />

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
    </>
  )
}
