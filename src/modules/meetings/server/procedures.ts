import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE
} from '@/constants'

import { db } from '@/db'
import { agents, meetings } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

import { meetingsInsertSchema, meetingsUpdateSchema } from '../schemas'

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings)
        })
        .from(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, userId)))

      if (!existingMeeting) {
        throw new Error('Meeting not found or access denied')
      }

      return existingMeeting
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration:
            sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as(
              'duration'
            )
        })
        .from(meetings)
        .innerJoin(agents, eq(agents.id, meetings.agentId))
        .where(
          and(
            eq(meetings.userId, ctx.session.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(agents.id, meetings.agentId))
        .where(
          and(
            eq(meetings.userId, ctx.session.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined
          )
        )

      const totalPages = Math.ceil(total.count / pageSize)

      return {
        items: data,
        total: total.count,
        totalPages
      }
    }),
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [newMeeting] = await db
        .insert(meetings)
        .values({ ...input, userId })
        .returning()

      // todo: create stream call, upseart stream users

      return newMeeting
    }),
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, userId)))
        .returning()

      if (!updatedMeeting) {
        throw new Error('Meeting not found or access denied')
      }

      return updatedMeeting
    })
})
