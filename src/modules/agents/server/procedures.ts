import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE
} from '@/constants'

import { db } from '@/db'
import { agents } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'

import { agentsInsertSchema } from '../schemas'

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          // todo: replace with actual meeting count
          meetingCount: sql`5`
        })
        .from(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, userId)))

      if (!existingAgent) {
        throw new Error('Agent not found or access denied')
      }

      return existingAgent
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
          ...getTableColumns(agents),
          // todo: replace with actual meeting count
          meetingCount: sql`1`
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.session.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.session.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
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
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const baseName = input.name.trim()

      const generateUniqueName = async (attempt = 0): Promise<string> => {
        const candidateName =
          attempt === 0 ? baseName : `${baseName} ${attempt + 1}`

        const [existing] = await db
          .select({ id: agents.id })
          .from(agents)
          .where(and(eq(agents.name, candidateName), eq(agents.userId, userId)))
          .limit(1)

        if (!existing) {
          return candidateName
        }

        if (attempt >= 999) {
          throw new Error('Unable to generate unique agent name')
        }

        return generateUniqueName(attempt + 1)
      }

      try {
        const uniqueName = await generateUniqueName()

        const [createdAgent] = await db
          .insert(agents)
          .values({
            ...input,
            name: uniqueName,
            userId
          })
          .returning()

        return createdAgent
      } catch (error) {
        if (error instanceof Error && error.message.includes('unique')) {
          const fallbackName = `${baseName} ${Date.now().toString().slice(-6)}`

          const [createdAgent] = await db
            .insert(agents)
            .values({
              ...input,
              name: fallbackName,
              userId
            })
            .returning()

          return createdAgent
        }

        throw error
      }
    })
})
