import { Box, ChakraProvider, Button, Spinner, Center } from '@chakra-ui/react'
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/api'
import theme from '../utils/theme'
import {useRouter} from 'next/router'
import useStore from '../store'


function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()
  const setUser = useStore(state => state.setUser)
  const user = useStore(state => state.user)
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    //supabase auth listener on authentication change
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // handleAuthChange(event, session)
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // console.log('signed in')
        //if signed in event fires fetch user from firebase
        checkUser(() => {
          router.push('/app')
        })
      }
      if (event === 'SIGNED_OUT') {
        setIsLoading(false)
        router.push('/')
        setUser(null)
      }
    })

    checkUser()
    return () => {
      authListener?.unsubscribe()
    }
  }, [])


  type UserData = {
    id: string,
    user_id: string,
    name: string,
    avatar: string,
    email: string,
    default_currency: string
}

  async function checkUser(cb?: () => void) {

    let res = await fetch('/api/auth/me')
    let resData = await res.json()
    let user = resData.user

    if (user) {
      let {id, email, last_sign_in_at, ...rest} = user
      // console.log(id);
      const {data: userData, error: userError} = await supabase.from<UserData>('users').select('*').eq('user_id', id)
      // console.log('user data', userData);
      let name, avatar, default_currency
      if (!userData || userData.length == 0) {
        name = '' 
        avatar = '' 
        default_currency = '' 
      } else {
        name = userData[0].name
        avatar = userData[0].avatar
        default_currency = userData[0].default_currency
      }
      setUser({id, email, last_sign_in_at, name: name, avatar: avatar, default_currency})
      if (cb) {
        cb()
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!user) {
      if (router.pathname == '/' || router.pathname.includes('/signup')) {
        setHasPermission(true)
      } else {
        setHasPermission(false)
      }
    } else {
      setHasPermission(true)
    }
  }, [router.pathname, user])

    //EXAMPLE setting user cookie if needed for server side auth checking 
    // async function handleAuthChange(event: AuthChangeEvent, session: Session | null) {
    //   await fetch('/api/auth', {
    //     method: 'POST',
    //     headers: new Headers({ 'Content-Type': 'application/json' }),
    //     credentials: 'same-origin',
    //     body: JSON.stringify({ event, session }),
    //   })
    // }

  if (isLoading) {
    return <ChakraProvider theme={theme}>
      <UserProvider supabaseClient={supabaseClient}>
      <Center mx='auto' maxW="xl" h='full'>
            <Spinner color="teal.500"/>
        </Center>
      </UserProvider>
      </ChakraProvider>
  }
  

  if (!hasPermission) {
    return <ChakraProvider theme={theme}>
      <UserProvider supabaseClient={supabaseClient}>
      <Box mx='auto' maxW="xl" h='full'>
            <Box>No permission <Button onClick={() => router.push('/')}>Back to login</Button></Box>
        </Box>
        </UserProvider>
      </ChakraProvider>

  }

  return (
    <ChakraProvider theme={theme}>
       <UserProvider supabaseClient={supabaseClient}>
      <Box mx='auto' maxW="xl" h='full'>
        <Component {...pageProps} />
        </Box>
        </UserProvider>
    </ChakraProvider> 
  )
}

export default MyApp
