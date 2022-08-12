import {useEffect, useState} from 'react'
import {Box, HStack, Button} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import AppButton from '../AppButton'
import {RiHomeFill} from 'react-icons/ri'
import {BsFillBarChartFill, BsFillPersonFill, BsFillWalletFill} from 'react-icons/bs'
import {AiOutlinePlus} from 'react-icons/ai'
import useStore from '../../store'
        
const GroupNavigation = () => {

    const setShowNewTransactionDrawer = useStore(state => state.setShowNewTransactionDrawer)
    const [showAddBtn, setShowAddBtn] = useState(true)
    const [activePage, setActivePage] = useState('')
    const router = useRouter()

    useEffect(() => {
        setActivePage(router.pathname.split('/app/[groupId]')[1])
        if (router.pathname !== '/app/[groupId]') {
            setShowAddBtn(false)
        } else {
            setShowAddBtn(true)
        }
    }, [router.asPath])

    return (
        <Box position="absolute" bottom="0px" left="0px" h="50px" shadow="md" roundedTop="md" w="full" bg="white">

            <HStack h="full" w="full" display="flex" justifyContent="space-between" px="10px" alignItems="center">
                <Box display="flex" justifyContent="space-around" alignItems="center" flex="1">
                    <Button onClick={() => router.push(`/app/${router.query.groupId}`)} cursor={"pointer"} rounded="full" variant="ghost" _hover={{ bg: 'var(--chakra-colors-gray-50)' }} _active={{ bg: 'var(--chakra-colors-gray-100)' }} color={activePage == '' ? "blue.400" : "gray.600"}><RiHomeFill /></Button>
                    <Button onClick={() => router.push(`/app/${router.query.groupId}/stats`)} cursor={"pointer"} rounded="full" variant="ghost" _hover={{bg: 'var(--chakra-colors-gray-50)'}} _active={{bg: 'var(--chakra-colors-gray-100)'}} color={activePage == '/stats' ? "blue.400" : "gray.600"}><BsFillBarChartFill /></Button>
                </Box>

                {showAddBtn && <Box>
                    <AppButton onClick={() => setShowNewTransactionDrawer(true)} mb="30px" w="60px" h="60px" rounded="full">
                        <AiOutlinePlus style={{ fontSize: '1.3rem' }} />
                    </AppButton>
                </Box>}

                <Box display="flex" justifyContent="space-around" alignItems="center" flex="1">
                    <Button onClick={() => router.push(`/app/${router.query.groupId}/shopping`)} cursor={"pointer"}  rounded="full" variant="ghost" _hover={{bg: 'var(--chakra-colors-gray-50)'}} _active={{bg: 'var(--chakra-colors-gray-100)'}} color={activePage == '/shopping' ? "blue.400" : "gray.600"}><BsFillWalletFill /></Button>
                    <Button onClick={() => router.push(`/app/${router.query.groupId}/profile`)} cursor={"pointer"}  rounded="full" variant="ghost" _hover={{bg: 'var(--chakra-colors-gray-50)'}} _active={{bg: 'var(--chakra-colors-gray-100)'}} color={activePage == '/profile' ? "blue.400" : "gray.600"}><BsFillPersonFill /></Button>
                </Box>
            </HStack>

        </Box>
    )
}

export default GroupNavigation