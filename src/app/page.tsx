'use client'

import { useState } from 'react'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  const { data: session } = authClient.useSession()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = () => {
    authClient.signUp.email(
      { name, email, password },
      {
        onerror: error => {
          console.error(error)
        },
        onSuccess: user => {
          console.log(user)
        }
      }
    )
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <Button
          onClick={() => {
            authClient.signOut()
          }}
        >
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Name'
      />
      <Input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
      />
      <Input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Password'
      />

      <Button onClick={onSubmit}>Sign Up</Button>
    </div>
  )
}
