import {useEffect, useState} from 'react'
import {Button, Box, Text, HStack, Spacer, Spinner, Center} from '@chakra-ui/react'
import {supabase, fetchTransactions as fetchTransactionsFromDb} from '../../utils/api'
import TransactionItem from './TransactionItem'
import useStore from '../../store'

const TransactionsHistory = () => {

    const activeGroup = useStore(state => state.activeGroup)
    const [transactions, setTransactions] = useState<any[] | undefined>([])
    const [transactionsLoading, setTransactionsLoading] = useState(true)

    async function fetchTransactions() {
        try {
                setTransactionsLoading(true)
                let res = await fetchTransactionsFromDb(activeGroup?.id || '', false)
                setTransactions(res)
                setTransactionsLoading(false)
        } catch (err) {
                console.log(err);
        } finally {
                setTransactionsLoading(false)
        }
    }



    useEffect(() => {

        fetchTransactions()        

        const mySubscription = supabase.from('transactions').on("*", payload => {
            setTransactionsLoading(true)
            // console.log("CHANGE", payload)
            if (payload.eventType === "INSERT") {
                fetchTransactions()
            }
            if (payload.eventType === "DELETE") {
                fetchTransactions()
             }
            setTransactionsLoading(false)
        })
        .subscribe()

        return () => supabase.removeSubscription(mySubscription)

    }, []) 


    return (
        <Box px="20px">
            <HStack mb="10px">
                <Text fontWeight="bold" color="gray.600">Transactions History</Text>
                <Spacer />
                <Text color="gray.500" fontSize="sm">See all</Text>
            </HStack>
            {transactionsLoading ?
                <Center mt="10px">
                    <Spinner />
                </Center>
                : 
                <Box>
                    {transactions.map((t, i) => {
                        if (i < 4) return <TransactionItem name={t.name} date={t.date} amount={t.amount} currency={t.currency} type={t.type} key={t.id} />
                    })}
                </Box>
            }
        </Box>
    )
}

export default TransactionsHistory