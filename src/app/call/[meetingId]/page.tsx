import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'

import CallView from '@/modules/call/ui/views/call-view'

interface MeetingIdPageProps {
  params: Promise<{ meetingId: string }>
}

export default async function MeetingIdPage({ params }: MeetingIdPageProps) {
  const { meetingId } = await params

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/sign-in')

  const queryCliente = getQueryClient()

  void queryCliente.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  )

  return (
    <HydrationBoundary state={dehydrate(queryCliente)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <CallView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
