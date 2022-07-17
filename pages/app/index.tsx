import type {NextPage, GetServerSidePropsContext} from 'next'
import { useRouter } from 'next/router'
import {Box, Button, HStack, Spacer} from '@chakra-ui/react'
import { supabase } from '../../utils/api'
import useStore from '../../store'
import UserHeroSection from '../../components/homePage/UserHeroSection'
import UserGroups from '../../components/homePage/UserGroups'
import {IoIosLogOut} from 'react-icons/io'
import {AiOutlinePlus} from 'react-icons/ai'
import AppButton from '../../components/AppButton'

const Home: NextPage = () => {

    const router = useRouter()
    const user = useStore(state => state.user)

    const logOut = async () => {
        await supabase.auth.signOut() 
        router.push('/')
    }

    return (
        <Box w="full" h="full" bg="gray.50">
            <UserHeroSection user={user} />            
            <UserGroups />


            <HStack position="fixed" bottom="5px" left="0px" w="full">
                <HStack maxW="xl" w="full" mx="auto" px="10px">
                <AppButton onClick={logOut} rounded="full" w="50px" h="50px" bg="blue.500">
                    <IoIosLogOut style={{transform: 'scaleX(-1)', fontSize: '30px'}} />
                </AppButton>
                <Spacer />
                <AppButton rounded="full" w="50px" h="50px" bg="blue.500">
                    <AiOutlinePlus />
                </AppButton>
                </HStack>
            </HStack>
    </Box>
    )
}

export default Home

// EXAMPLE server side route protection 
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const {user} = await supabase.auth.api.getUserByCookie(context.req)

//     if (!user) {
//         return {
//             props: {}, redirect: { destination: "/"}
//         }
//     }

//     return {props: {user}}
// }