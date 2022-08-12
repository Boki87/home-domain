import {Text, HStack, Avatar, Box, Spacer } from "@chakra-ui/react"
import {returnTimeAgo, formatNumberToCurrency} from '../../utils'


interface TransactionItemProps {
    name: string,
    date: string,
    amount: number,
    currency: string,
    type: string
}


const TransactionItem = ({name, date, amount, currency, type} : TransactionItemProps) => {
    
    return (
        <HStack mb="10px">
            <Avatar name={name} />
            <Box>
                <Text color="gray.800" fontSize="md" fontWeight="bold">{name}</Text>
                <Text color="gray.500" fontSize="sm">{returnTimeAgo(+new Date(date))}</Text>
            </Box>
            <Spacer />
            <Text fontSize="xl" fontWeight="bold" color={type === 'expense' ? 'red.400' : 'green.400'}>{type === 'expense' ? '- ' : '+ '}{formatNumberToCurrency(amount, currency)}</Text>
        </HStack>
    )
}

export default TransactionItem