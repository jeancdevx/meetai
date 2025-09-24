import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon
} from 'lucide-react'

import { useMeetingsFilters } from '@/hooks/use-meetings-filters'

import CommandSelect from '@/components/command-select'

import { MeetingStatus } from '../../types'

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <ClockArrowUpIcon className='stroke-[2.5]' />
        Upcoming
      </div>
    )
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <CircleCheckIcon className='stroke-[2.5]' />
        Completed
      </div>
    )
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <VideoIcon className='stroke-[2.5]' />
        Active
      </div>
    )
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <LoaderIcon className='stroke-[2.5]' />
        Processing
      </div>
    )
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <CircleXIcon className='stroke-[2.5]' />
        Canceled
      </div>
    )
  }
]

const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters()

  return (
    <CommandSelect
      placeholder='Filter by status'
      className='h-9'
      options={options}
      onSelect={(value: string) =>
        setFilters({ status: value as MeetingStatus })
      }
      value={filters.status ?? ''}
    />
  )
}

export { StatusFilter }
