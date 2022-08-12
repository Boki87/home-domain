import {SyntheticEvent, useEffect, useRef, useState} from 'react'
import {Box, Spinner, Stack, Text, Center, HStack, IconButton, Spacer, PopoverTrigger, PopoverContent, Popover, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, Button} from '@chakra-ui/react'
import {AiFillRightCircle, AiFillEdit, AiFillDelete} from 'react-icons/ai'
import {BsThreeDotsVertical} from 'react-icons/bs'
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
                {!loadingGroups && userGroups?.map((group) => <GroupCard key={group.id} activeUserId={user?.id || '' } group={group} />)}
            </Stack> 
        </Stack>
    )
}



const GroupCard = ({group, activeUserId}: {group: UserGroup, activeUserId: string }) => {
    const router = useRouter()
    const takeToGroup = () => {
            router.push(`/app/${group.id}`)
    }

    const {isOpen, onOpen, onClose} = useDisclosure()
    const cancelRef = useRef()
    const deleteGroup = useStore(state => state.deleteGroup)
    const setGroupDrawerId = useStore(state => state.setGroupDrawerId)

    return <HStack  h="60px" bg="white" shadow="sm" borderRadius="2xl" cursor="pointer">
        <Box w="full" position="relative" display="flex">

            <Box minW="60px" display="flex" alignItems="center" justifyContent="center">
            {group.created_by === activeUserId &&
            <>
                <Popover >
                    <PopoverTrigger>
                        <IconButton variant="ghost" onClick={(e: SyntheticEvent) => e.stopPropagation}aria-label="Edit group" icon={<BsThreeDotsVertical />} />
                    </PopoverTrigger>
                    <PopoverContent w="200px" p="10px">
                        <Box onClick={() => setGroupDrawerId(group.id)} h="40px" rounded="md" bg="gray.50" display="flex" alignItems="center" justifyContent="flex-start" px="10px" my="5px"> <AiFillEdit style={{marginRight: '10px'}} /> Edit</Box>
                            <Box h="40px" rounded="md" bg="gray.50" display="flex" alignItems="center" justifyContent="flex-start" px="10px" my="5px" onClick={onOpen}> <AiFillDelete style={{marginRight: '10px'}} /> Delete</Box>
                    </PopoverContent> 
                </Popover>
           <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Group?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this group?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
                            <Button colorScheme='red' ml={3} onClick={() => {
                                deleteGroup(group.id)
                                onClose()
                            }}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
                    </AlertDialog>
                </>
            }
            </Box>

            <Box flexGrow="1" textAlign="center">
                <Text noOfLines={1} onClick={takeToGroup} fontSize="3xl" fontStyle="italic" bgGradient="linear(to-r, var(--chakra-colors-blue-200),var(--chakra-colors-teal-300) )" fontWeight="extrabold" bgClip="text" mr="15px">{group.name}</Text>
            </Box> 

            <Box minW="40px" display="flex" alignItems="center" justifyContent="center">
                <AiFillRightCircle onClick={takeToGroup} style={{color: 'var(--chakra-colors-teal-300)', fontSize: '25px'}} />
            </Box>

        </Box> 
    </HStack>
}



export default UserGroups