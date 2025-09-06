'use client'

import { useRouter } from 'next/navigation'

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react'

import { authClient } from '@/lib/auth-client'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const DashboardUserButton = () => {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const onLogOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        }
      }
    })
  }

  if (isPending || !session?.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border-border/10 flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border bg-white/5 p-3 transition-colors hover:bg-white/10'>
        {session.user.image ? (
          <Avatar>
            <AvatarImage src={session.user.image} alt={session.user.name} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={session.user.name}
            variant='initials'
            className='mr-3 size-9'
          />
        )}

        <div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
          <p className='w-full truncate text-sm'>{session.user.name}</p>
          <p className='text-muted-foreground w-full truncate text-xs'>
            {session.user.email}
          </p>
        </div>

        <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 stroke-3 opacity-50' />
      </DropdownMenuTrigger>

      <DropdownMenuContent side='right' align='end' className='ml-2 w-72'>
        <DropdownMenuLabel>
          <div className='flex flex-col gap-1'>
            <span className='truncate text-sm font-medium'>
              {session.user.name}
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              {session.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className='flex flex-col gap-1'>
          <DropdownMenuItem className='flex cursor-pointer items-center justify-between text-xs font-semibold'>
            Billing
            <CreditCardIcon className='size-4 opacity-50' />
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onLogOut}
            className='flex cursor-pointer items-center justify-center bg-red-400/10 text-xs font-semibold text-red-700 hover:text-red-700 focus:bg-red-400/15 focus:text-red-700'
          >
            Sign out
            <LogOutIcon className='size-4 stroke-2 text-red-700 opacity-50' />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DashboardUserButton }
