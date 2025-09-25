import EmptyState from '@/components/empty-state'

const ProcessingState = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
      <EmptyState
        title='Your meeting has been successfully completed!'
        description='Meeting is currently being processed, a summary will be available shortly. '
        image='/processing.svg'
      />
    </div>
  )
}

export { ProcessingState }
