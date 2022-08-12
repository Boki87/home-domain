import {useState, useEffect, SyntheticEvent} from 'react'
import {HStack, Text, Box, Input, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, Center, Spacer, Button, useToast } from "@chakra-ui/react"
import  useStore  from '../../store'
import { fetchGroupData } from '../../utils/api'
import { supabase } from '../../utils/api'
import AppButton from '../AppButton'
import {MdDeleteOutline} from 'react-icons/md'
import { fetchMembersForGroup, deleteMemberFromGroup } from '../../utils/api'
import MembersList from '../MembersList'


const GroupDrawer = () => {

    const toast = useToast()
    const user = useStore(state => state.user)
    const groupDrawerId = useStore(state => state.groupDrawerId)
    const setGroupDrawerId = useStore(state => state.setGroupDrawerId)

    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [groupName, setGroupName] = useState('')
    const updateGroup = useStore(state => state.updateGroup)
    const createNewGroup = useStore(state => state.createNewGroup)

    const [email, setEmail] = useState('')
    const [invitedEmails, setInvitedEmails] = useState<{id: string, email: string}[]>([])
    const [invitesLoading, setInvitesLoading] = useState(false)
    const [members, setMembers] = useState<any[]>([])
    const [membersLoading, setMembersLoading] = useState(false)

    async function fetchFreshGroupData(groupId: string) {
        try {
            setIsLoading(true)

            const freshGroupData = await fetchGroupData(groupId)
            const membersRes = await fetchMembersForGroup(groupDrawerId)
            setMembers(membersRes)

            setGroupName(freshGroupData.name)

            setIsLoading(false)
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error',
                status: 'error',
                description: 'Could not fetch group data',
                duration: 4000,
                isClosable: true
            })
            setIsLoading(false)
        }

    }


    async function fetchFreshMembersData() {
        try {
            setMembersLoading(true)
            const membersRes = await fetchMembersForGroup(groupDrawerId)
            setMembers(membersRes)
            setMembersLoading(false)
        } catch (err) {
            
            toast({
                title: 'Error',
                status: 'error',
                description: 'Could not fetch members',
                duration: 4000,
                isClosable: true
            })
            setMembersLoading(false)
        }
    }

    useEffect(() => {
        if (groupDrawerId === 'new') {
            setGroupName('')
        } else if (groupDrawerId !== '') {
            fetchFreshGroupData(groupDrawerId)
            fetchInvites()
        }

        if (groupDrawerId == '') {
            setGroupName('')
            setIsLoading(false)
        }

    }, [groupDrawerId])


    async function onSubmit() {
       
        setIsUpdating(true)
        if (groupDrawerId !== '' && groupDrawerId !== 'new') {
            await updateGroup({id: groupDrawerId, name: groupName.trim()})
            setIsUpdating(false)
        }

        if (groupDrawerId === 'new') {
            await createNewGroup({name: groupName.trim(), created_by: user?.id})
            setIsUpdating(false)
        }
    }


    async function sendInvite() {
        try {
            setInvitesLoading(true)
            let res = await fetch('/api/send-invite', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    group_id: groupDrawerId,
                    email: email 
                })
            })
            let resFinal = await res.json()
            if (resFinal.error) {
                toast({
                    title: 'Error',
                    status: 'error',
                    description: resFinal.message,
                    duration: 4000,
                    isClosable: true
                })
            }
            await fetchInvites()
            setEmail('')
            setInvitesLoading(false)
        } catch (err) {
            console.log(err);
            setInvitesLoading(false)
            toast({
                title: 'Error',
                status: 'error',
                description: 'Could not send invite',
                duration: 4000,
                isClosable: true
            })
        } finally {
            setInvitesLoading(false)
        }
    }

    async function fetchInvites() {
       const {data, error}  = await supabase.from<{id: string, email: string}>('invites').select('*').match({group_id: groupDrawerId})

        if(error) throw Error

        setInvitedEmails(data)
    }

    async function deleteInvite(id: string) {
        const {data, error} = await supabase.from('invites').delete().match({id: id})
        if(error) alert('Error deleting invite')
        setInvitedEmails(invitedEmails.filter(inv => inv.id !== id))
    }

    async function deleteMemberHandler(userId: string) {

        try {
            setMembersLoading(true)
            const deleteRes = await deleteMemberFromGroup(userId)
            console.log(deleteRes);
            const newMembers = members.filter(m => m.user_id !== userId)
            setMembers(newMembers)
            setMembersLoading(true)
        } catch (err) {
            console.log(err);
        } finally {
            setMembersLoading(false)           
        }

    }

    return (
        <Drawer placement="bottom" isOpen={groupDrawerId != ''} onClose={() => {setGroupDrawerId('')}} size="full">
            <DrawerOverlay />
            <DrawerContent borderTopRadius="md" h="full">
                <Box w="full" maxW="xl" mx="auto" position="relative">

                <DrawerCloseButton />
                {isLoading ? 
                <DrawerBody h="full">
                    <Center h="full" w="full">
                        <Spinner size="xl" mt="100px"/>     
                    </Center>
                </DrawerBody>
                    :   
           <>         
                <DrawerHeader textAlign="center">{groupDrawerId === "new" ? 'Create a new group' : 'Update Group'}</DrawerHeader>
                <DrawerBody>
                    <Box>
                                    <Input placeholder="Group Name" value={groupName} onInput={(e: SyntheticEvent) => {
                                        let input = (e.target as HTMLInputElement)
                                        setGroupName(input.value)
                                    }} size="md" />
                    </Box>
                                {groupDrawerId !== '' && groupDrawerId !== 'new' && 
                                <>
                                    <Box mt="10px">
                                                <Text>Send invite by email:</Text>
                                                <HStack>
                                                    <Input
                                                        value={email}
                                                        onInput={(e) => {
                                                            let inputValue = (e.target as HTMLInputElement).value
                                                            setEmail(inputValue)
                                                        }}
                                                        placeholder="john.doe@email.com"
                                                    />
                                                    <AppButton disabled={email === ""} isLoading={invitesLoading} onClick={sendInvite}>Send</AppButton>
                                                </HStack>
                                    </Box>

                                    {invitedEmails.length > 0 && <Box mt="10px">
                                        <Text fontWeight="bold" fontSize="md" color="gray.700">Invites sent to: </Text>
                                        {invitedEmails.map(invitedEmail => {
                                            return (
                                                <Box w="full" h="40px" display="flex" alignItems="center" px="10px" bg="gray.50" rounded="md" mb="7px" key={invitedEmail.id}>
                                                    {invitedEmail.email}
                                                    <Spacer />
                                                    <Button size="sm" onClick={() => deleteInvite(invitedEmail.id)}><MdDeleteOutline /></Button>
                                                </Box>
                                            )
                                        })}
                                    </Box>}

                                    <Box mt="10px">
                                        <Text fontWeight="bold" fontSize="md" color="gray.700">Members</Text>
                                        {membersLoading && <Center><Spinner /></Center>}
                                        {!membersLoading && <MembersList owner={user ? user.id : ''} members={members} deleteMember={deleteMemberHandler} />}
                                        
                                    </Box>
                                </>                    
                    }

                </DrawerBody>
            </>
            }

                    <Center position="fixed" w="100%" bottom="10px" left="0px">
                        <AppButton onClick={onSubmit} isLoading={isUpdating}>{groupDrawerId === "new" ? "Create" : "Update"}</AppButton>
                    </Center>
                </Box>

            </DrawerContent>
        </Drawer>
    )
}

export default GroupDrawer