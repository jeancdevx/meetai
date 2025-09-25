import EmptyState from '@/components/empty-state'

const CancelledState = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
      <EmptyState
        title='Your meeting is cancelled'
        description='Meeting cannot be resumed once cancelled.'
        image='/cancelled.svg'
      />
    </div>
  )
}

export { CancelledState }
