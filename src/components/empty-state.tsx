import Image from 'next/image'

interface ErrorStateProps {
  title: string
  description: string
  image?: string
}

const EmptyState = ({
  title,
  description,
  image = '/empty.svg'
}: ErrorStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center px-8 py-4'>
      <Image
        src={image}
        alt='Empty State placeholder'
        width={240}
        height={240}
      />

      <div className='mx-auto flex max-w-md flex-col gap-y-3 text-center'>
        <h6 className='text-xl font-semibold'>{title}</h6>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
    </div>
  )
}

export default EmptyState
