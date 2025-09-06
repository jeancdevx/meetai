'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { EyeIcon, EyeOffIcon, OctagonAlertIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email(),
  password: z.string().min(1, 'Password is required')
})

const SignUpView = () => {
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)
    setPending(true)

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password
      },
      {
        onSuccess: () => {
          setPending(false)
          router.push('/')
          toast.success('Successfully signed up!')
        },
        onError: ({ error }) => {
          setPending(false)
          setError(error.message)
          toast.error('Failed to sign up.')
        }
      }
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 lg:grid-cols-2'>
          <Form {...form}>
            <form className='p-6 lg:p-8' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-3xl font-bold'>Let&apos;s get started</h1>
                  <p className='text-muted-foreground text-sm font-medium text-balance md:text-xs'>
                    Create your account
                  </p>
                </div>

                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            type='text'
                            placeholder='John Doe'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='m@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder='********'
                              className='pr-10'
                              {...field}
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <EyeOffIcon className='h-4 w-4' />
                              ) : (
                                <EyeIcon className='h-4 w-4' />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!!error && (
                  <Alert
                    variant='destructive'
                    className='bg-destructive/10 border-none text-sm'
                  >
                    <OctagonAlertIcon className='h-4 w-4' />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Button type='submit' className='w-full' disabled={pending}>
                  Create Account
                </Button>

                <div className='after:border-border relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='bg-card text-muted-foreground relative z-10 px-2'>
                    Or continue with
                  </span>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='outline' type='button' disabled={pending}>
                    Google
                  </Button>
                  <Button variant='outline' type='button' disabled={pending}>
                    GitHub
                  </Button>
                </div>

                <div className='text-center text-sm'>
                  <p className='text-muted-foreground'>
                    Already have an account?{' '}
                    <Link
                      href='/sign-in'
                      className={cn(
                        'font-medium text-green-600',
                        pending && 'pointer-events-none'
                      )}
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </Form>

          <div className='relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-green-700 to-green-900 lg:flex'>
            <Image src='/logo.svg' alt='MeetAI Logo' width={92} height={92} />
            <p className='text-2xl font-semibold text-white'>MeetAI</p>
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground [&_a]:hover:text-primary text-center text-xs font-medium text-balance'>
        <p>By clicking &quot;Create Account&quot;, you agree to our</p>
        <p>
          <a href='/terms' target='_blank' rel='noreferrer'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' target='_blank' rel='noreferrer'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export { SignUpView }
