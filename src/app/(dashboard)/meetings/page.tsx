import { Suspense } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'

import { MeetingsView } from '@/modules/meetings/ui/views/meetings-view'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

export default function MeetingsPage() {
  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title='Loading Meetings...'
            description='This may take a moment'
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title='Failed to load Meetings'
              description='Please try again later'
            />
          }
        >
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
