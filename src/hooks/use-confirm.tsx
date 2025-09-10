import { JSX, useState } from 'react'

import ResponsiveDialog from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'

export const useConfirm = (
  title: string,
  description: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => {
    return new Promise<unknown>(resolve => {
      setPromise({ resolve })
    })
  }

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const RemoveConfirmationDialog = () => (
    <ResponsiveDialog
      open={promise !== null}
      onOpenChange={handleClose}
      title={title}
      description={description}
    >
      <div className='flex w-full flex-col-reverse items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row'>
        <Button
          onClick={handleCancel}
          variant='outline'
          className='w-full lg:w-auto'
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant='destructive'
          className='w-full lg:w-auto'
        >
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  )

  return [RemoveConfirmationDialog, confirm]
}
