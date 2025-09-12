import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  ne,
  sql
} from 'drizzle-orm'
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

import { agentsInsertSchema, agentsUpdateSchema } from '../schemas'

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),
          // todo: replace with actual meeting count
          meetingCount: sql<number>`5`
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
          meetingCount: sql<number>`1`
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

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(and(eq(agents.name, input.name), eq(agents.userId, userId)))
        .limit(1)

      if (existingAgent) {
        const similarAgents = await db
          .select()
          .from(agents)
          .where(
            and(eq(agents.userId, userId), ilike(agents.name, `${input.name}%`))
          )
        const similarNames = similarAgents.map(a => a.name)
        let suffix = 1
        let newName = `${input.name} (${suffix})`
        while (similarNames.includes(newName)) {
          suffix++
          newName = `${input.name} (${suffix})`
        }
        input.name = newName
      }

      const [newAgent] = await db
        .insert(agents)
        .values({ ...input, userId })
        .returning()

      return newAgent
    }),
  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [conflictingAgent] = await db
        .select()
        .from(agents)
        .where(
          and(
            eq(agents.userId, userId),
            eq(agents.name, input.name),
            ne(agents.id, input.id)
          )
        )
        .limit(1)

      if (conflictingAgent) {
        throw new Error('Another agent with this name already exists')
      }

      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(and(eq(agents.id, input.id), eq(agents.userId, userId)))
        .returning()

      if (!updatedAgent) {
        throw new Error('Agent not found or access denied')
      }

      return updatedAgent
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id

      const [removedAgent] = await db
        .delete(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, userId)))
        .returning()

      if (!removedAgent) {
        throw new Error('Agent not found or access denied')
      }

      return removedAgent
    })
})
