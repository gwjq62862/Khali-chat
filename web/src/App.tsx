import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'


const App = () => {
  return (
    <div>
      <h1>Hello Vite + React + Clerk</h1>
       <SignedOut>
        <SignInButton mode='modal' />
        <SignUpButton mode='modal'/>
      </SignedOut>
   
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default App