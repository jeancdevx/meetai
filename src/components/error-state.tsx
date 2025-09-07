import { AlertCircleIcon } from 'lucide-react'

interface ErrorStateProps {
  title: string
  description: string
}

const ErrorState = ({ title, description }: ErrorStateProps) => {
  return (
    <div className='flex flex-1/2 items-center justify-center px-8 py-4'>
      <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
        <AlertCircleIcon className='size-6 text-red-500' />

        <div className='flex flex-col gap-y-1 text-center'>
          <h6 className='text-lg font-semibold'>{title}</h6>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorState
