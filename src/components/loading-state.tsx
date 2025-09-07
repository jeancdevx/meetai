import { Loader2Icon } from 'lucide-react'

interface LoadingStateProps {
  title: string
  description: string
}

const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className='flex flex-1/2 items-center justify-center px-8 py-4'>
      <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
        <Loader2Icon className='text-primary size-6 animate-spin' />

        <div className='flex flex-col gap-y-1 text-center'>
          <h6 className='text-lg font-semibold'>{title}</h6>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
