import {useState, SyntheticEvent} from 'react'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import {Text, Box, Center, Stack, FormControl, InputGroup, InputLeftElement, Input, InputRightElement, Button, HStack, Link, useToast} from '@chakra-ui/react'
import {FaUserAlt, FaLock} from "react-icons/fa"
import { supabase } from '../utils/api'
import AppButton from '../components/AppButton'


const Login: NextPage = () => {

  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  function handleShowClick() {
    setShowPassword(!showPassword)
  }

  function inputChangeHandler(e: SyntheticEvent) {
    let input = (e.target as HTMLInputElement)
    
    setForm({
      ...form,
      [input.name]: input.value
    })
  }


  async function formSubmitHandler(e: SyntheticEvent) {
    e.preventDefault()
      setIsLoading(true)
        const { user, session, error } = await supabase.auth.signIn({
          email:form.email,
          password: form.password
        })

      if (error) {
        toast({
          title: 'Error',
          description: 'Wrong email or password',
          status: 'error',
          duration: 4000,
          isClosable: true
        })
      }
        setIsLoading(false)
  }


  return (
    <Box w="full" h="full">
        <Center w="full" h="full" bg="gray.100" p="2" overflow="hidden">
            <Stack w="sm" shadow={'sm'} bg="white" rounded="md" p="4">
          <form onSubmit={formSubmitHandler}>
            <Stack>
            <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUserAlt style={{color: 'var(--chakra-colors-gray-400'}} />}
                  />
                  <Input value={form.email} required name="email" onInput={inputChangeHandler} type="email" placeholder="email address" />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaLock style={{color: 'var(--chakra-colors-gray-400'}} />}
                  />
                  <Input
                    name="password"
                    value={form.password}
                    type={showPassword ? "text" : "password"}
                    onInput={inputChangeHandler}
                    required
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                </FormControl>
                <Center>
                  <AppButton isLoading={isLoading} type="submit">Login</AppButton>
                </Center>
                  <Center>
                    <Text color="gray.500">Don't have an account? <NextLink href="/signup" passHref><Link color={"blue.500"}>Signup here</Link></NextLink></Text>
                  </Center>
</Stack>
          </form>
            </Stack>
        </Center>
    </Box>
  )
}

export default Login
