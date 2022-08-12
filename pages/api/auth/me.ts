import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'

type Data = {
    user: any
}


async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const user = await getUser({req, res})

    return res.status(200).json({...user})
}

export default handler