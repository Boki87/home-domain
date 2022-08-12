import {useEffect, useState} from 'react'
import {Center, Spinner, Button, Box, HStack, Text, Spacer, VStack} from '@chakra-ui/react'
import useStore from '../../store'
import {VscBell} from 'react-icons/vsc'
import {BsArrowDown, BsArrowUp, BsChevronLeft} from 'react-icons/bs'
import { useRouter } from 'next/router'
import { formatNumberToCurrency } from '../../utils'
import {supabase} from '../../utils/api'


const OverviewPageHeader = () => {

    const router = useRouter()
    const activeGroup = useStore(state => state.activeGroup)
    const user = useStore(state => state.user)
    const [loadingSum, setLoadingSum] = useState(false)
    const [sum, setSum] = useState({
        income: 0,
        expenses: 0,
        balance: 0
    })
    

    async function fetchTransactionsSum() {
        let currency = 'EUR'
        if (user) {
            if (user.default_currency) {
                currency = user.default_currency
            }
        }
        try {
            setLoadingSum(true)
            let res = await fetch('/api/transactions/' + router.query.groupId + '?currency=' + currency , {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                })
            let transSum = await res.json()
            setSum({
                income: transSum.data.monthlyIncome,
                expenses: transSum.data.monthlyExpenses,
                balance: transSum.data.balance
            })
            setLoadingSum(false)
        } catch (err) {

        } finally {
            setLoadingSum(false)
        }

    }


    useEffect(() => {

        fetchTransactionsSum() 

        // const mySubscription = supabase.from('transactions').on("*", payload => {
        //   fetchTransactionsSum()
        // })
        // .subscribe()

        // return () => supabase.removeSubscription(mySubscription)
    }, [])

    return <Box h="200px" w="full" bg="blue.400" roundedBottom="xl" pt="20px" position="relative" mb="120px">

        <HStack px="20px">
            <Box onClick={() => router.push('/app')} color="white" w="30px" display="flex" justifyContent="center">
                <BsChevronLeft style={{fontSize:"20px"}} />
            </Box>
            <Box>
                <Text color="whiteAlpha.700" mb="-10px">Welcome back to</Text>
                <Text color="whiteAlpha.800" fontSize="3xl" fontWeight="extrabold">{activeGroup?.name}</Text>
            </Box>
            <Spacer />
            <Button bg="blue.400" colorScheme="blue" color="whiteAlpha.600" maxW="60px">
                <VscBell style={{ fontSize: "1.6rem" }} />
                <Box position="absolute" top="10px" right="15px" w="10px" h="10px" bg="orange.400" rounded="full"></Box>
            </Button>
        </HStack>

        <Box h="200px" w="90%" bg="blue.500" left="5%" bottom="-100px" position="absolute" rounded="2xl" p="15px" shadow="xl">
            {loadingSum ? 
            
                <Center h="full"><Spinner color="white" size="lg" /></Center>
                :
                <>
                    <Box h="85px">
                        <Text color="whiteAlpha.700" fontWeight="bold">Total Balance</Text>
                        <Text color="whiteAlpha.800" fontSize="2xl" fontWeight="extrabold">{formatNumberToCurrency(sum.balance)}</Text>
                    </Box>
                    <HStack h="85px">
                        <Box h="full">
                            <HStack>
                                <Box w="25px" h="25px" display="flex" alignItems="center" justifyContent="center" bg="whiteAlpha.300" rounded="full" color="white" fontSize="sm">
                                    <BsArrowDown />
                                </Box>
                                <Text color="whiteAlpha.700" fontWeight="bold">Income</Text> 
                            </HStack>
                            <Text color="whiteAlpha.900" fontWeight="bold">{ formatNumberToCurrency(sum.income)}</Text>
                        </Box>
                        <Spacer />
                        <Box h="full">
                            <HStack>
                                <Box w="25px" h="25px" display="flex" alignItems="center" justifyContent="center" bg="whiteAlpha.300" rounded="full" color="white" fontSize="sm">
                                    <BsArrowUp />
                                </Box>
                                <Text color="whiteAlpha.700" fontWeight="bold">Expenses</Text> 
                            </HStack>
                            <Text color="whiteAlpha.900" fontWeight="bold">{formatNumberToCurrency(sum.expenses)}</Text>
                        </Box>
                    </HStack>
                </>
            }
        </Box>
    </Box>
}

export default OverviewPageHeader