import {SyntheticEvent, useState} from 'react'
import type { NextPage } from "next";
import NextLink from 'next/link'
import {Box, Center, Stack, FormControl, Link, Text, InputGroup, InputLeftElement, Input, InputRightElement, Button} from '@chakra-ui/react'
import {FaUserAlt, FaLock} from "react-icons/fa"
import { useRouter } from 'next/router';
import { supabase } from '../utils/api';
import AppButton from '../components/AppButton'


const SignUp: NextPage = () => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
      password: '',
        password_confirm: ''
    })
    const [emailDisabled, setEmailDisabled] = useState(false)

    function inputChangeHandler(e: SyntheticEvent) {
    let input = (e.target as HTMLInputElement)
    
    setForm({
      ...form,
      [input.name]: input.value
    })
  }




  async function formSubmitHandler(e: SyntheticEvent) {
    e.preventDefault()

   //just create new user
        const { user, session, error } = await supabase.auth.signUp({
          email:form.email,
          password: form.password
        })

        const { data, error: dataError } = await supabase.from('users').insert({
          user_id: user?.id,
          email: form.email,
          name: '',
          avatar: ''
        })

  }

    return (
    <Box w="full" h="full">
        <Center w="full" h="full" bg="gray.100" p="1">
            <Stack w="sm" shadow={'sm'} bg="white" rounded="md" p="4">
              <form onSubmit={formSubmitHandler}>
                <Stack>
            <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUserAlt style={{color: 'var(--chakra-colors-gray-400)'}} />}
                  />
                  <Input value={form.email} disabled={emailDisabled} required name="email" onInput={inputChangeHandler} type="email" placeholder="email address" />
                </InputGroup>
              </FormControl>
            <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaLock style={{color: 'var(--chakra-colors-gray-400)'}} />}
                  />
                  <Input value={form.password} required name="password" onInput={inputChangeHandler} type="password" placeholder="password" />
                </InputGroup>
              </FormControl>
            <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaLock style={{color: 'var(--chakra-colors-gray-400)'}} />}
                  />
                  <Input value={form.password_confirm} required name="password_confirm" onInput={inputChangeHandler} type="password" placeholder="confirm password" />
                </InputGroup>
              </FormControl>
              <Center>
                  <AppButton isLoading={isLoading} type="submit">Sign up</AppButton>
                </Center>
                  <Center>
                    <Text color="gray.500">Already have an account? <NextLink href="/" passHref><Link color={"blue.500"}>Login here</Link></NextLink></Text>
                  </Center>
                  </Stack>
              </form>
              </Stack>
              </Center>

        </Box>
    )
}

export default SignUp