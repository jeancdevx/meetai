import DashboardSidebar from '@/modules/dashboard/ui/components'

import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className='bg-muted flex h-screen w-screen flex-col'>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default DashboardLayout
