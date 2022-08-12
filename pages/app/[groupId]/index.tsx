import { useEffect, useState } from "react";
import type { NextPage } from "next";
import {useRouter} from 'next/router'
import {Box, Text, Spinner, Center } from '@chakra-ui/react'
import { fetchGroupData, fetchMembersForGroup } from "../../../utils/api";
import useStore from "../../../store";
import GroupPageLayout from "../../../components/groupPage/GroupPageLayout";
import OverviewPageHeader from '../../../components/groupPage/OverviewPageHeader'
import TransactionsHistory from '../../../components/groupPage/TransactionsHistory'
import MembersList from "../../../components/MembersList";
import NewTransactionDrawer from "../../../components/groupPage/NewTransactionDrawer";

const GroupPage: NextPage = () => {

    const [loading, setLoading] = useState(true)
    const members = useStore(state => state.members)
    const setMembers = useStore(state => state.setMembers)
    const user = useStore(state => state.user)

    const setActiveGroup = useStore(state => state.setActiveGroup)
    const activeGroup = useStore(state => state.activeGroup)

    const router = useRouter()
    const {groupId} = router.query


    async function fetchAllData() {
        setLoading(true) 
        if (typeof groupId == "string") {
            let groupData = await fetchGroupData(groupId)
            setActiveGroup(groupData)
            let members = await fetchMembersForGroup(groupId)
            // setGroup(groupData)
            setMembers(members)
        }
        setLoading(false) 
    }


    useEffect(() => {
        fetchAllData()
    }, [])


    return (
        <GroupPageLayout>
            {loading ? 
                <Center w="full" h="full">
                    <Spinner color="teal" size="xl"/>
                </Center>
                    : 
                <>
                    <OverviewPageHeader />
                    <TransactionsHistory />
                    <NewTransactionDrawer />

                    <Box px="20px">
                        <Text fontWeight="bold" color="gray.600">Members</Text>
                        <MembersList size={'lg'} members={members} owner={user?.id || ''} />
                    </Box>
                </>
            }
        </GroupPageLayout>
    )

}

export default GroupPage