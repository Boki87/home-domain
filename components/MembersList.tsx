import {Center, Avatar, AvatarGroup, AvatarBadge} from "@chakra-ui/react"

import type {User} from '../store'


// interface MembersListProps {
//     id: string,
//     user_id: string,
//     avatar: string,
//     name: string
// }

const MembersList = ({members, size = 'md', deleteMember, owner}: {members: User[], size?: string, deleteMember?: (userId: string) => void, owner: string}) => {



    return (
        <AvatarGroup max={4}>
            {members.map(member => {
                return (
                    <Avatar src={member.avatar} name={member.name} size={size} key={member.id}>
                        {member.user_id !== owner && deleteMember && <AvatarBadge onClick={() => deleteMember(member.user_id || "")} bg="red.600" boxSize="1.3rem" cursor="pointer">
                            <Center w="full" h="full">
                                <span style={{ color: 'white' }}>-</span>
                            </Center>
                        </AvatarBadge>}
                    </Avatar>
                )
            })}
        </AvatarGroup>
    )
}

export default MembersList