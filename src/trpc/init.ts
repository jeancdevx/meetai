import { cache } from 'react'

import { headers } from 'next/headers'

import { initTRPC, TRPCError } from '@trpc/server'
import { count, eq } from 'drizzle-orm'

import { db } from '@/db'
import { agents, meetings } from '@/db/schema'
import { auth } from '@/lib/auth'
import { polarClient } from '@/lib/polar'

import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants'

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' }
})
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    })

  return next({ ctx: { ...ctx, session } })
})
export const premiumProcedure = (entity: 'meetings' | 'agents') =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const userId = ctx.session.user.id
    const customer = await polarClient.customers.getStateExternal({
      externalId: userId
    })

    const [userMeetings] = await db
      .select({
        count: count(meetings.id)
      })
      .from(meetings)
      .where(eq(meetings.userId, userId))

    const [userAgents] = await db
      .select({
        count: count(agents.id)
      })
      .from(agents)
      .where(eq(agents.userId, userId))

    const isPremium = customer.activeSubscriptions.length > 0

    const isFreeAgentsLimitReached = userAgents.count >= MAX_FREE_AGENTS
    const isFreeMeetingsLimitReached = userMeetings.count >= MAX_FREE_MEETINGS

    const shouldThrowAgentError =
      entity === 'agents' && isFreeAgentsLimitReached && !isPremium
    const shouldThrowMeetingError =
      entity === 'meetings' && isFreeMeetingsLimitReached && !isPremium

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Free plan limit reached. You can create up to ${MAX_FREE_MEETINGS} meetings. Please upgrade to a premium plan to create more meetings.`
      })
    }

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Free plan limit reached. You can create up to ${MAX_FREE_AGENTS} agents. Please upgrade to a premium plan to create more agents.`
      })
    }

    return next({ ctx: { ...ctx, customer } })
  })
