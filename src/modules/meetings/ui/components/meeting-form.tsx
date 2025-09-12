'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useTRPC } from '@/trpc/client'

import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog'

import CommandSelect from '@/components/command-select'
import { GeneratedAvatar } from '@/components/generated-avatar'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { meetingsInsertSchema } from '../../schemas'
import { MeetingGetOne } from '../../types'

interface MeetingFormProps {
  initialValues?: MeetingGetOne
  onSuccess?: (id?: string) => void
  onCancel?: () => void
}

const MeetingForm = ({
  initialValues,
  onSuccess,
  onCancel
}: MeetingFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false)
  const [agentSearch, setAgentSearch] = useState('')

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch })
  )

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onMutate: () => {
        toast.loading('Creating meeting...', { id: 'create-meeting' })
      },
      onSuccess: async data => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        // todo: invalidate free tier usage

        onSuccess?.(data.id)

        toast.success('Meeting created', { id: 'create-meeting' })
      },
      onError: error => {
        toast.error(`Error creating meeting: ${error.message}`, {
          id: 'create-meeting'
        })

        // todo: check if error code is "forbidden"
      }
    })
  )

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onMutate: () => {
        toast.loading('Updating meeting...', { id: 'update-meeting' })
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        )

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          )
        }

        onSuccess?.()

        toast.success('Meeting updated', { id: 'update-meeting' })
      },
      onError: error => {
        toast.error(`Error updating meeting: ${error.message}`, {
          id: 'update-meeting'
        })
      }
    })
  )

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? ''
    }
  })

  const isEdit = !!initialValues?.id
  const isPending = createMeeting.isPending || updateMeeting.isPending

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      agentId: values.agentId.trim()
    }

    if (isEdit) {
      if (!initialValues?.id) {
        toast.error('Error updating meeting: missing meeting ID')
        return
      }

      updateMeeting.mutate({ id: initialValues.id, ...trimmedValues })
    } else {
      createMeeting.mutate(trimmedValues)
    }
  }

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={() => setOpenNewAgentDialog(false)}
      />

      <Form {...form}>
        <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='e.g. "Math consultations"'
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='agentId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map(agent => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className='flex items-center gap-x-2'>
                          <GeneratedAvatar
                            seed={agent.name}
                            variant='botttsNeutral'
                            className='size-6 border'
                          />
                          <span>{agent.name}</span>
                        </div>
                      )
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder='Select an agent'
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{' '}
                  <button
                    type='button'
                    className='text-primary font-semibold'
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
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
    </>
  )
}

export default MeetingForm
