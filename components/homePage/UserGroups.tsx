import {useEffect} from 'react'
import {Box, Spinner, Stack, Text, Center, HStack} from '@chakra-ui/react'
import {AiFillRightCircle} from 'react-icons/ai'
import useStore, { UserGroup } from '../../store'
import { useRouter } from 'next/router'

const UserGroups = () => {

    const user = useStore(state => state.user)
    const userGroups = useStore(state => state.userGroups)
    const fetchGroups = useStore(state => state.fetchGroups)
    const loadingGroups = useStore(state => state.loadingGroups)

    useEffect(() => {

        if (user) {
            fetchGroups(user.id)
        }

    }, [])


    return (
        <Stack mt="20px" px="20px">
            <Center>
                <Text mb="10px" fontSize="4xl" bgGradient="linear(to-r, var(--chakra-colors-blue-400),var(--chakra-colors-teal-200) )" fontWeight="extrabold" bgClip="text">Your Groups</Text>
            </Center>
            <Stack>
                {loadingGroups && <Center><Spinner color="teal.500" size="xl" /></Center>}
                {!loadingGroups && userGroups?.map((group) => <GroupCard key={group.id} group={group} />)}
            </Stack> 
        </Stack>
    )
}



const GroupCard = ({group}: {group: UserGroup}) => {
    const router = useRouter()
    const takeToGroup = () => {
            router.push(`/app/${group.id}`)
    }


    return <HStack onClick={takeToGroup} h="60px" bg="white" shadow="sm" borderRadius="2xl" cursor="pointer">
        <Center w="full">
            <Text fontSize="3xl" fontStyle="italic" bgGradient="linear(to-r, var(--chakra-colors-blue-200),var(--chakra-colors-teal-300) )" fontWeight="extrabold" bgClip="text" mr="15px">{group.name}</Text>

            <AiFillRightCircle style={{color: 'var(--chakra-colors-teal-300)', fontSize: '25px'}} />

        </Center> 
    </HStack>
}



export default UserGroups