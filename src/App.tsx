import { useSubscribeDev } from '@subscribe.dev/react'
import { SignInScreen } from './components/SignInScreen'
import { RatVideoGenerator } from './components/RatVideoGenerator'
import './App.css'

function App() {
  const { isSignedIn, signIn } = useSubscribeDev()

  if (!isSignedIn) {
    return <SignInScreen signIn={signIn} />
  }

  return <RatVideoGenerator />
}

export default App
