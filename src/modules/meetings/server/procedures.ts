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
import { generateAvatarUri } from '@/lib/avatar'
import { streamVideo } from '@/lib/stream-video'

import { meetingsInsertSchema, meetingsUpdateSchema } from '../schemas'
import { MeetingStatus } from '../types'

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user

    await streamVideo.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: 'admin',
        image:
          user.image ??
          generateAvatarUri({
            seed: user.name,
            variant: 'initials'
          })
      }
    ])

    const expirationTime = Math.floor(Date.now() / 1000) + 3600 // Token valid for 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60

    const token = streamVideo.generateUserToken({
      user_id: user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt
    })

    return token
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`
              CASE
                WHEN ${meetings.startedAt} IS NOT NULL AND ${meetings.endedAt} IS NOT NULL
                THEN EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))
                ELSE NULL
              END
            `.as('duration')
        })
        .from(meetings)
        .innerJoin(agents, eq(agents.id, meetings.agentId))
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
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled
          ])
          .nullish()
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search, agentId, status } = input

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`
              CASE
                WHEN ${meetings.startedAt} IS NOT NULL AND ${meetings.endedAt} IS NOT NULL
                THEN EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))
                ELSE NULL
              END
            `.as('duration')
        })
        .from(meetings)
        .innerJoin(agents, eq(agents.id, meetings.agentId))
        .where(
          and(
            eq(meetings.userId, ctx.session.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
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
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
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
      const call = streamVideo.video.call('default', newMeeting.id)

      await call.create({
        data: {
          created_by_id: userId,
          custom: {
            meetingId: newMeeting.id,
            meetingName: newMeeting.name
          },
          settings_override: {
            transcription: {
              language: 'en',
              mode: 'auto-on',
              closed_caption_mode: 'auto-on'
            },
            recording: {
              mode: 'auto-on',
              quality: '1080p'
            }
          }
        }
      })

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, newMeeting.agentId))

      if (!existingAgent) {
        throw new Error('Agent not found or access denied')
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: 'user',
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: 'botttsNeutral'
          })
        }
      ])

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
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [deletedMeeting] = await db
        .delete(meetings)
        .where(and(eq(meetings.id, input.id), eq(meetings.userId, userId)))
        .returning()

      if (!deletedMeeting) {
        throw new Error('Meeting not found or access denied')
      }

      return deletedMeeting
    })
})
