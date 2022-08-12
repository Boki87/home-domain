import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs'
import {supabase} from '../../../utils/api'

async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') { 

            const {groupId, currency} = req.query
            // console.log("currency", currency)
        
            //fetch currency values 
            let currencyRates = await fetch('https://api.exchangerate.host/latest?base=' + currency)
            let currencyRatesRes = await currencyRates.json()
            // console.log(currencyRatesRes)


            let {data, error} = await supabase.from('transactions').select('*').match({group_id: groupId})

            if(error) return res.status(500).json({error: true, message: 'Could not calculate transactions'})
    
            let totalIncome = 0
            let totalExpenses = 0
            let monthlyIncome = 0
            let monthlyExpenses = 0
            let balance = 0        
        if (data) {
            data.forEach(t => {
                let now = new Date()
                let nowFull = now.getFullYear() + now.getMonth()
                let tDate = new Date(t.date.split(" ")[0]) 
                let tDateFull = tDate.getFullYear() + tDate.getMonth()

                if (t.type === 'income') {
                    totalIncome += t.amount / currencyRatesRes.rates[t.currency]
                    if (nowFull === tDateFull) {
                        monthlyIncome += t.amount / currencyRatesRes.rates[t.currency]
                    }
                }

                if (t.type === 'expense') {
                    totalExpenses += t.amount / currencyRatesRes.rates[t.currency]
                    if (nowFull === tDateFull) {
                        monthlyExpenses += t.amount / currencyRatesRes.rates[t.currency]
                    }
                }
            })
            balance = totalIncome - totalExpenses
        }

        return res.status(200).json({
            error: false, data: {
                totalIncome,
                totalExpenses,
                monthlyIncome,
                monthlyExpenses,
                balance
            } })
    }
}

export default withApiAuth(handler)