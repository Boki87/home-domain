import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
import {supabase} from '../../utils/api'
import nodemailer from 'nodemailer'

type RequestData = {
    group_id: string,
    email: string
}


async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { body } : {body: RequestData} = req
    //check if email already a member
    const {data: userCheck, error: userCheckError} = await supabase.from<{user_id: string}>('users').select().match({email: body.email})

    if (userCheckError) {
        return res.status(500).json({ error: true, message: "Something went wrong" })
    }

    const {data: memberCheckData, error: memberCheckError} = await supabase.from('groups_users').select().match({user_id: userCheck[0].user_id, group_id: body.group_id})

    if (memberCheckError) {
        return res.status(500).json({ error: true, message: "Something went wrong" })
    }

    if (memberCheckData?.length > 0) {

        return res.status(408).json({ error: true, message: "Member with provided email already exists" })
    }

    //check if invite already sent to email
    const {data: emailCheck, error} = await supabase.from('invites').select().match({email: body.email})

    if (emailCheck?.length !== 0) {
        return res.status(408).json({ error: true, message: "Invite already sent to this email" })
    }

    const { data, error: inviteError } = await supabase.from<{id: string, email: string, group_id: string}>('invites').insert([
        {email: body.email, group_id: body.group_id}
    ])

    if (inviteError) {
        return res.status(500).json({ error: true, message: "Something went wrong" })
    }
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "homeburger881@gmail.com",
            pass: 'ckpujncmsoeljtrx'
        },
    })

    const domain = process.env.NODE_ENV == 'development' ? `http://localhost:3000/invite?invite_id=${data[0].id}` : `https://somedomain.com/invite?invite_id=${data[0].id}`

    transporter.sendMail({
        from: 'bot@homebudget.com',
        to: body.email,
        subject: `Group invitation`,
        // text: "test text",
        html: `
        <div>
            You have been invited to be part of a home budget group.
            Your link: <a href="${domain}">LINK</a>
        </div> 
        `
    }, (err, info) => {
        if (err) {
            // console.log(err)
            return res.status(500).json({ error: true, message: "Something went wrong" })
        } else {
            // console.log(info)
        }
    })

    return res.status(200).json({ error: false, message: "Invite successfully sent to email" })

}

export default withApiAuth(handler)