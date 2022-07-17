import { Box, ChakraProvider, Button, Spinner, Center } from '@chakra-ui/react'
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
      console.log(event)
      // handleAuthChange(event, session)
      if (event === 'SIGNED_IN') {
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
    email: string
}

  async function checkUser(cb?: () => void) {
    const user = await supabase.auth.user()
    if (user) {
      let {id, email, last_sign_in_at, ...rest} = user
      // console.log(id);
      const {data: userData, error: userError} = await supabase.from<UserData>('users').select('*').eq('user_id', id)
      // console.log('user data', userData);
      let name, avatar
      if (!userData || userData.length == 0) {
        name = '' 
        avatar = '' 
      } else {
        name = userData[0].name
        avatar = userData[0].avatar
      }
      setUser({id, email, last_sign_in_at, name: name, avatar: avatar})
      if (cb) {
        cb()
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!user) {
      if (router.pathname == '/' || router.pathname == '/signup') {
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
      <Center mx='auto' maxW="xl" h='full'>
            <Spinner color="teal.500"/>
            </Center>
      </ChakraProvider>
  }
  

  if (!hasPermission) {
    return <ChakraProvider theme={theme}>
      <Box mx='auto' maxW="xl" h='full'>
            <Box>No permission <Button onClick={() => router.push('/')}>Back to login</Button></Box>
      </Box>
      </ChakraProvider>

  }

  return (
    <ChakraProvider theme={theme}>
      <Box mx='auto' maxW="xl" h='full'>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider> 
  )
}

export default MyApp
