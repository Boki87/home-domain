import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { supabase, deleteGroup as deleteGroupFromDb, updateGroupName, createGroup } from '../utils/api'

export type User = {
    user_id?:string,
    id: string,
    email?: string | undefined,
    last_sign_in_at?: string | undefined,
    avatar: string | undefined,
    name: string | undefined,
    default_currency?: string
}

export type UserGroup = {
    id?: string,
    name: string
    user_id?: string,
    created_by?: string
}

interface AppStore {
    user: User | null,
    isAuthenticated: boolean,
    setUser: (user: User | null) => void,

    userGroups: UserGroup[] | null,
    fetchGroups: (userId: string) => void
    loadingGroups: boolean,
    deleteGroup: (groupId: string) => void,
    groupDrawerId: string,
    setGroupDrawerId: (groupId: string) => void,
    updateGroup: (groupData: any) => void,
    createNewGroup: (groupData: UserGroup) => void,

    activeGroup: UserGroup | null,
    setActiveGroup: (group: UserGroup | null) => void,

    members: User[] | [],
    setMembers: (members: User[] | []) => void,

    showNewTransactionDrawer: boolean,
    setShowNewTransactionDrawer: (val: boolean) => void,
}

const useStore = create<AppStore, [['zustand/devtools', AppStore]]>(devtools((set) => ({
    user:  null,
    isAuthenticated: false,
    setUser: (user: User | null) => {
        set(state => ({user: user})) 
    },
    userGroups: [],
    fetchGroups: async (userId) => {
        try {
            set({loadingGroups: true})
            const response = await supabase.from<UserGroup & {groups: {name: string, created_by: string}, group_id: string}>('groups_users').select('*, groups(name, created_by)').eq('user_id', userId)
            // console.log(response)
            if (response.error) {
                throw response?.error
            }

            set({
                userGroups: response.data.map(res => {
                let {groups,id, ...rest} = res
                return {...rest, name: groups.name, id: res.group_id, created_by: groups.created_by}
            })})
            set({loadingGroups: false})
        } catch (err) {
            console.log(err)
            set({loadingGroups: false})
        }
    },
    loadingGroups: false,
    deleteGroup: async (groupId) => {
        try {
            const deletedGroup = await deleteGroupFromDb(groupId)
            set( state => ({
                userGroups: state?.userGroups?.filter(group => group.id !== groupId)
            }))
        } catch (err) {

        }
    },
    groupDrawerId: '',
    setGroupDrawerId: (groupId) => {
        set({groupDrawerId: groupId})
    },
    updateGroup: async (groupData) => {
        try {
            await updateGroupName(groupData.id, groupData.name)
            set(state => ({
                userGroups: state.userGroups?.map(group => {
                    if (group.id === groupData.id) {
                        return {...group, ...groupData}
                    } else {
                        return group
                    }
                })
            }))
        } catch (err) {
            console.log(err)
        }
    },
    createNewGroup: async (groupData) => {
        try {
            const newGroup = await createGroup(groupData)
            set(state => (
                {
                    userGroups: [...state.userGroups, ...newGroup]
                }
            ))
        } catch (err) {
            console.log(err)
        }
    },

    activeGroup: null,
    setActiveGroup: (group) => {

        set({
                activeGroup: group
        })
        
    }, 

    members: [],
    setMembers: (members) => {

        set({members: members})

    },

    showNewTransactionDrawer: false,
    setShowNewTransactionDrawer: (val: boolean) => {
        set({showNewTransactionDrawer: val})
    }
}))
)

export default useStore