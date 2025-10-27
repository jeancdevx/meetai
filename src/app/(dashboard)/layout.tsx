import {
  DashboardNavbar,
  DashboardSidebar
} from '@/modules/dashboard/ui/components'

import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className='bg-muted flex min-h-svh w-screen flex-col'>
        <DashboardNavbar />

        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
