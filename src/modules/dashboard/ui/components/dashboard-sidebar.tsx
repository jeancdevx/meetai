'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BotIcon, StarIcon, VideoIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { DashboardUserButton } from './dashboard-user-button'

const firstSection = [
  {
    icon: VideoIcon,
    label: 'Meetings',
    href: '/meetings'
  },
  {
    icon: BotIcon,
    label: 'Agents',
    href: '/agents'
  }
]

const secondSection = [
  {
    icon: StarIcon,
    label: 'Upgrade',
    href: '/upgrade'
  }
]

const DashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className='text-sidebar-accent-foreground'>
        <Link href='/' className='flex items-center gap-2 px-2 pt-2'>
          <Image src='/logo.svg' alt='Logo' width={36} height={36} />
          <p className='text-2xl font-semibold'>Meet.AI</p>
        </Link>
      </SidebarHeader>

      <div className='px-4 py-2'>
        <Separator className='text-[#5D6B68] opacity-10' />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map(({ icon: Icon, label, href }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 from-5% via-30% hover:bg-linear-to-r/oklch',
                      pathname === href && 'bg-linear-to-r/oklch'
                    )}
                    isActive={pathname === href}
                  >
                    <Link href={href}>
                      <Icon className='size-5 stroke-[2.5]' />
                      <span className='text-sm font-semibold tracking-tight'>
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className='px-4'>
          <Separator className='text-[#5D6B68] opacity-10' />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map(({ icon: Icon, label, href }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'from-sidebar-accent via-sidebar/50 to-sidebar/50 h-10 from-5% via-30% hover:bg-linear-to-r/oklch',
                      pathname === href && 'bg-linear-to-r/oklch'
                    )}
                    isActive={pathname === href}
                  >
                    <Link href={href}>
                      <Icon className='size-5 stroke-[2.5]' />
                      <span className='text-sm font-semibold tracking-tight'>
                        {label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='text-white'>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export { DashboardSidebar }
