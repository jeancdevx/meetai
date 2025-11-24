import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'

import { UpgradeView } from '@/modules/premium/ui/views/upgrade-view'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/sign-in')

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  )

  void queryClient.prefetchQuery(trpc.premium.getProducts.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title='Loading'
            description='This may take a few seconds'
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState title='Error' description='Please try again later' />
          }
        >
          <UpgradeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}
