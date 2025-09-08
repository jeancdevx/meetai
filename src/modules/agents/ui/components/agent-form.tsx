'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useTRPC } from '@/trpc/client'

import { AgentGetOne } from '@/modules/agents/types'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { agentsInsertSchema } from '../../schemas'

interface AgentFormProps {
  initialValues?: AgentGetOne
  onSuccess?: () => void
  onCancel?: () => void
}

const AgentForm = ({ initialValues, onSuccess, onCancel }: AgentFormProps) => {
  const router = useRouter()

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions())

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          )
        }

        onSuccess?.()
        toast.success('Agent created successfully')
      },
      onError: error => {
        toast.error(error.message ?? 'Something went wrong creating the agent')

        // todo: check if error code is "forbidden"
      }
    })
  )

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? ''
    }
  })

  const isEdit = !!initialValues?.id
  const isPending = createAgent.isPending

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      instructions: values.instructions.trim()
    }

    if (isEdit) {
      console.log('edit', trimmedValues)
    } else {
      createAgent.mutate(trimmedValues)
    }
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex items-center justify-center'>
          <GeneratedAvatar
            seed={form.watch('name') || 'New Agent'}
            variant='botttsNeutral'
            className='size-16 border'
          />
        </div>

        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. "Math Bot"'
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name='instructions'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='e.g. "You are a patient and encouraging math tutor named MathBot. Your role is to help students understand mathematical concepts through step-by-step explanations and interactive problem-solving."'
                  {...field}
                  disabled={isPending}
                  className='max-h-32 min-h-[128px] resize-none overflow-y-auto'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-between gap-x-2'>
          {onCancel && (
            <Button
              type='button'
              variant='ghost'
              disabled={isPending}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isEdit ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AgentForm
