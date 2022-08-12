import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
import {supabase} from '../../utils/api'

async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') { 

            const {body} = req

            let { quantity, group_id } = body

            let {data, error} = await supabase.from('transactions').select('amount, type').match({group_id})

            if(error) return res.status(500).json({error: true, message: 'Could not calculate transactions'})

    
            let income = 0
            let expenses = 0
              
           
        if (data) {
            data.forEach(t => {
                if (t.type === 'income') {
                    income += t.amount
                }
                if (t.type === 'expense') {
                    expenses += t.amount
                }
            })
        }
        

        return res.status(200).json({
            error: false, data: {
                income,
                expenses
            } })
    }
        


}

export default withApiAuth(handler)