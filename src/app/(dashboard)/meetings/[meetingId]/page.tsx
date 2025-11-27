import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'

import MeetingIdView from '@/modules/meetings/ui/views/meeting-id-view'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

interface MeetingIdPageProps {
  params: Promise<{
    meetingId: string
  }>
}

export default async function MeetingIdPage({ params }: MeetingIdPageProps) {
  const { meetingId } = await params

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/sign-in')

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title='Loading Meeting...'
            description='This may take a moment'
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title='Failed to load Meeting'
              description='Please try again later'
            />
          }
        >
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
