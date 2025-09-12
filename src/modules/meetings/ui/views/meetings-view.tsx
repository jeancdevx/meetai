'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

const MeetingsView = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

  return <div>{JSON.stringify(data)}</div>
}

export { MeetingsView }
