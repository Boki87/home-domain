// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getUser, withApiAuth} from '@supabase/supabase-auth-helpers/nextjs'

type Data = {
  name?: any,
  error?: any
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const {user} = await getUser({req, res})
    if(!user) throw Error('Could not get user')
    res.status(200).json({ name: user })
}

export default withApiAuth(handler)