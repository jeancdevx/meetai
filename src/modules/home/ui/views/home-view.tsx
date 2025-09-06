'use client'

import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'

const HomeView = () => {
  const router = useRouter()

  const { data: session } = authClient.useSession()

  return (
    <div>
      <div>Hello {session?.user?.name}</div>

      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push('/sign-in')
              }
            }
          })
        }
      >
        Sign out
      </Button>
    </div>
  )
}

export { HomeView }
