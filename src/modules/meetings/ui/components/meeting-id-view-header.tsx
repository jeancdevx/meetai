'use client'

import Link from 'next/link'

import {
  ChevronRightIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface MeetingIdViewHeaderProps {
  // meetingId: string
  meetingName: string
  onEdit: () => void
  onRemove: () => void
}

const MeetingIdViewHeader = ({
  // meetingId,
  meetingName,
  onEdit,
  onRemove
}: MeetingIdViewHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className='text-xl font-semibold'>
              <Link href='/meetings'>Meetings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className='text-foreground text-xl font-semibold [&>svg]:size-4'>
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className='text-foreground text-xl font-semibold capitalize'
            >
              <span>{meetingName}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={onEdit}
            className='text-xs font-semibold text-black'
          >
            <PencilIcon className='size-4 text-black' />
            Edit meeting
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className='text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600'
          >
            <TrashIcon className='size-4 text-red-600' />
            Remove meeting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { MeetingIdViewHeader }
