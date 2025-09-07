'use client'

import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

const HomeView = () => {
  const trpc = useTRPC()

  const { data } = useQuery(trpc.hello.queryOptions({ text: 'jeancarlo' }))

  return <div className='flex flex-col gap-y-4 p-4'>{data?.greeting}</div>
}

export { HomeView }
