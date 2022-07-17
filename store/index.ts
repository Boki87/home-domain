import { selector } from '@chakra-ui/layout/dist/declarations/src/stack.utils'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { supabase } from '../utils/api'

export type User = {
    id: string,
    email: string | undefined,
    last_sign_in_at: string | undefined,
    avatar: string | undefined,
    name: string | undefined
}

export type UserGroup = {
    id: string,
    name: string
    user_id: string,
    created_by: string
}

interface AppStore {
    user: User | null,
    isAuthenticated: boolean,
    setUser: (user: User | null) => void,

    userGroups: UserGroup[] | null,
    fetchGroups: (userId: string) => void
    loadingGroups: boolean
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
            const response = await supabase.from<UserGroup & {groups: {name: string}, group_id: string}>('groups_users').select('*, groups(name)').eq('user_id', userId)
            // console.log(response)
            if (response.error) {
                throw response?.error
            }

            set({
                userGroups: response.data.map(res => {
                let {groups,id, ...rest} = res
                return {...rest, name: groups.name, id: res.group_id}
            })})
            set({loadingGroups: false})
        } catch (err) {
            console.log(err)
            set({loadingGroups: false})
        }
    },
    loadingGroups: false
}))
)

export default useStore