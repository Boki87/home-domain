import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { UserGroup} from "../store";
import type {User} from '../store'

const supabase = supabaseClient 

async function fetchGroupData(groupId: string) {
    const groupRes = await supabase.from<UserGroup>("groups").select(`
        id,
        name,
        created_by
    `).eq('id', groupId)

    if(groupRes.error) throw Error;
    
    return groupRes.data[0]
}

async function fetchMembersForGroup(groupId: string) {
    //fetch user_id's from groups_users table
    const membersRes = await supabase.from('groups_users').select(`
        user_id
    `).eq("group_id", groupId)

    if(membersRes.error) throw Error
    let membersIds = membersRes.data.map(m => m.user_id)
    let members = []

    //loop through all user_id's and fetch individual users from public users table that are members of same group
    for (let i = 0; i < membersIds.length; i++) {
        let membersFullRes = await supabase.from<User>("users").select("id, name, avatar, user_id").eq("user_id", membersIds[i])
        if (membersFullRes.data) {
            members.push(membersFullRes.data[0])
        }
    }
    return members
}

async function deleteMemberFromGroup(userId: string) {
    const { data, error } = await supabase.from('groups_users').delete().match({user_id: userId})

    if(error) throw Error

    return data
}

async function updateGroupName(groupId: string, groupName: string) {
    const {data, error} = await supabase.from('groups').update({name: groupName}).match({id: groupId})
    if(error) throw Error
    return data
}

async function createGroup(groupData: UserGroup) {
    const { data, error } = await supabase.from<UserGroup>('groups').insert([
        groupData
    ])
    if(error) throw Error

    const { data: membersData, error: membersError } = await supabase.from('groups_users').insert([
        {
            group_id: data[0].id,
            user_id: data[0].created_by
        }
    ])

    return data
}

async function fetchTaskListsForGroupOnDate(groupId: string) {

    let d = new Date()
    let year = d.getFullYear()
    let day = d.getDate()
    let monthNum = d.getMonth() + 1
    let month
    if (monthNum < 10) {
        month = "0" + monthNum
    }else {
        month = monthNum
    }

    let todayDate = `${year}-${month}-${day}`

    const taskRes = await supabase.from("task_lists").select('title, deadline').match({
        'group_id': groupId,
        deadline: todayDate
    })

    if(taskRes.error) throw Error

    return taskRes.data
}

async function deleteGroup(groupId: string) {
    //delete all relations to deleted group
    const {data: groupRelData, error: groupRelError} = await supabase.from('groups_users').delete().match({group_id: groupId})
    if(groupRelError) throw Error

    //delete group from groups table
    const {data, error} = await supabase.from('groups').delete().match({id: groupId})
    if(error) throw Error


    return data
}


async function fetchTransactions(groupId: string, all=true) {

    let data
    if (all) {
        let {data: dataRes, error} = await supabase.from('transactions').select('*').match({group_id: groupId})
        data = dataRes
        if(error) throw Error
    } else {
        //TODO: figure out how to filter by date (timestampz)
        let { data: dataRes, error } = await supabase.from('transactions').select('*')
            // .filter('date', 'like', '%2022-08%')
            // .filter('group_id', 'is', groupId)
            .match({ group_id: groupId })

        if(error) throw Error


        //don't need this if figure out how to filter on database level
        let dateNow = new Date()
        let month = +dateNow.getMonth() < 10 ? '0' + (dateNow.getMonth() + 1) : +dateNow.getMonth()
        data = dataRes?.filter(d => d.date.includes(dateNow.getFullYear() + '-' + month))
    }


    let sortedData = data?.sort((a, b) => {
        let aDate = new Date(a.date).getTime()
        let bDate = new Date(b.date).getTime()
        return bDate - aDate
    })
    // console.log(sortedData)

    return sortedData
}

async function addTransaction(transactionData: any) {
    const {data, error} = await supabase.from('transactions').insert([transactionData])
    if(error) throw Error
    return data
}


export {
    supabase,
    fetchTransactions,
    addTransaction,
    fetchGroupData,
    fetchTaskListsForGroupOnDate,
    fetchMembersForGroup,
    deleteGroup,
    updateGroupName,
    createGroup,
    deleteMemberFromGroup
}