interface CallLayoutProps {
  children: React.ReactNode
}

export default function CallLayout({ children }: CallLayoutProps) {
  return <div className='h-screen bg-black'>{children}</div>
}
