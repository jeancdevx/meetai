'use client'

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon
} from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { cn, formatDuration } from '@/lib/utils'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'

import { MeetingGetMany } from '../../types'

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon
}

const statusColorMap = {
  upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
  processing: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
  cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5'
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row }) => (
      <div className='flex flex-col gap-y-1'>
        <span className='font-semibold capitalize'>{row.original.name}</span>

        <div className='flex items-center gap-x-1.5'>
          <div className='flex items-center gap-x-1'>
            <CornerDownRightIcon className='text-muted-foreground size-3' />
            <span className='text-muted-foreground max-w-[200px] truncate text-xs'>
              {row.original.agent.name}
            </span>
          </div>

          <GeneratedAvatar
            variant='botttsNeutral'
            seed={row.original.agent.name}
            className='size-4'
          />

          <span className='text-muted-foreground text-sm'>
            {row.original.startedAt
              ? format(row.original.startedAt, 'MMM d')
              : ''}
          </span>
        </div>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap]

      return (
        <Badge
          variant='outline'
          className={cn(
            'text-muted-foreground font-semibold capitalize [&>svg]:size-4',
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <Icon
            className={cn(
              row.original.status === 'processing' && 'animate-spin'
            )}
          />
          {row.original.status}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <Badge
        variant='outline'
        className='flex items-center gap-x-2 font-semibold capitalize [&>svg]:size-4'
      >
        <ClockFadingIcon className='text-blue-700' />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : row.original.status === 'completed'
            ? '0s'
            : 'No duration'}
      </Badge>
    )
  }
]
