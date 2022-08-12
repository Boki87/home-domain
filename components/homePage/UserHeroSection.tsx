import {Box, Avatar, Stack, Center, Text} from '@chakra-ui/react'
import {User} from '../../store'

const UserHeroSection = ({user}: {user: User | null}) => {


    return <Stack>
        <Center mt="10px">
            <Avatar size="2xl" name={user?.name} src={user?.avatar} />
        </Center>
        <Center>
            <Text noOfLines={1} fontWeight="bold" fontSize="2xl" color="gray.600">{user?.name}</Text>
        </Center>
    </Stack>
}


export default UserHeroSection