import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'

import { MeetingsListHeader } from '@/modules/meetings/ui/components/meetings-list-header'
import { MeetingsView } from '@/modules/meetings/ui/views/meetings-view'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

export default async function MeetingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/sign-in')

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <>
      <MeetingsListHeader />

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
    </>
  )
}
