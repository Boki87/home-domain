import { GetServerSideProps } from "next";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { supabase } from "../utils/api";

const InvitePage: NextPage = ({error, message}: {error?: string, message?: string}) => {


    return (<Center w="full" h="full">

            {/* <Spinner size="xl"/> */}
            
        {error && message && <Text>{message}</Text>}
    </Center>)
}

export default InvitePage

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    let inviteId = ctx.query.invite_id

    console.log('invite id:', inviteId);
    //get invite data
    const {data: inviteData, error: inviteError} = await supabase.from('invites').select().match({id: inviteId})

    if (inviteError || inviteData.length == 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    //check if user with email exists
    const {data: userCheck, error: userCheckError} = await supabase.from('users').select().match({email: inviteData[0].email})

    if (userCheckError) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (!userCheck || userCheck.length == 0) {
        //no user with email, send to signup page
        return {
            // redirect: {
            //     destination: '/signup?group_id=' + inviteData[0].group_id ,
            //     permanent: false
            // }
            props: {
                error: true,
                message: 'Please login firs and then open this link again.'
            }
        }
    }

    //check if user is already member
    const { data: memberCheck, error: memberCheckError } = await supabase.from('groups_users').select().match({
        user_id: userCheck[0].user_id,
        group_id: inviteData[0].group_id
    })

    if (memberCheckError || memberCheck.length > 0) {
        return {
            props: {
                error: true,
                message: 'User already member'
            }
        }
    }


    //add user to group
    const { data: userInviteData, error: userInviteError } = await supabase.from('groups_users').insert([{
        group_id: inviteData[0].group_id,
        user_id: userCheck[0].user_id
    }])

    console.log('invite data', userInviteData)

    if (userInviteError) {
        return {
            props: {
                error: true,
                message: 'Could not be added to group'
            }
        }
    }

    const {data: deleteInvite} = await supabase.from('invites').delete().match({id: inviteId})

   console.log('invite deleted', deleteInvite); 

    return {
        props: {}
    }
}