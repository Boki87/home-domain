import {Textarea, HStack, Text, Box, Input, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Spinner, Center, Spacer, Button, useToast, Checkbox, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"
import {addTransaction, supabase} from '../../utils/api'
import { SyntheticEvent, useEffect, useState } from "react"
import useStore from '../../store'
import AppButton from "../AppButton"

const NewTransactionDrawer = () => {

   const showNewTransactionDrawer = useStore(state => state.showNewTransactionDrawer) 
   const setShowNewTransactionDrawer = useStore(state => state.setShowNewTransactionDrawer) 

  const activeGroup = useStore(state => state.activeGroup)
  const user = useStore(state => state.user)

   const [transactionType, setTransactionType] = useState('expense')
   const [isRecurring, setIsRecurring] = useState(false)
   const [name, setName] = useState('')
   const [description, setDescription] = useState('')
   const [amount, setAmount] = useState(1)
   const [currency, setCurrency] = useState('')
   const [date, setDate] = useState('')

   const [isLoading, setIsLoading] = useState(false)
  
  async function submitHandler(e: SyntheticEvent) {
      e.preventDefault()
    try {
      setIsLoading(true)
      const resData = await addTransaction({
        name,
        description,
        amount,
        type: transactionType,
        is_recurring: isRecurring,
        currency,
        group_id: activeGroup?.id,
        user_id: user?.id,
        date: ((new Date(date)).toISOString()).toLocaleString('en-GB')
      })

      setTimeout(() => {
        setShowNewTransactionDrawer(false)
      }, 1000)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
      }
      console.log('submit');
  }

  function resetForm() {
    setName('')
    setCurrency('')
    setAmount(0)
    setDescription('')
    setIsRecurring(false)
    setTransactionType('expense')
  }

  useEffect(() => {
    if (!showNewTransactionDrawer) {
      resetForm()
    }
  }, [showNewTransactionDrawer])

    return (
        <Drawer placement={"bottom"} onClose={() => setShowNewTransactionDrawer(false)} isOpen={showNewTransactionDrawer} size="full">
        <DrawerOverlay />
        <DrawerContent roundedTop="xl">
        <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            <Text maxW="xl" mx="auto">
              Add a new transaction
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <Box maxW="xl" mx="auto">
            <form onSubmit={submitHandler}>
            <Box my="20px">
              <Input placeholder="Transaction Name" required value={name} onInput={(e: SyntheticEvent) => {
                  let input = (e.target as HTMLInputElement)
                  setName(input.value)
              }} size="md" />
            </Box>
            <Box my="20px">
              <Textarea  placeholder="Transaction description" value={description} onChange={(e: SyntheticEvent) => {
                let text = (e.target as HTMLInputElement)
                setDescription(text.value)
              }} />
            </Box>
            {/* Transaction Type Picker */}
            <Box maxW="xl" mx="auto">
                <HStack h="100px">
                <Box onClick={() => setTransactionType('expense')} w="50%" rounded="md" border={transactionType == 'expense' ? "2px" : "1px"} h="full" mr="5px" borderColor={transactionType === 'expense' ? "blue.400" : "gray.200"} display="flex" alignItems="center" justifyContent="center" cursor="pointer" bg={transactionType == 'expense' ? 'blue.50' : 'white'} _hover={{bg:'gray.50'}}>
                    <Text fontSize="xl" color="gray.700">
                      Expense
                    </Text>
                  </Box>
                  <Box onClick={() => setTransactionType('income')} w="50%" rounded="md" border={transactionType == 'income' ? "2px" : "1px"} h="full" ml="5px" borderColor={transactionType === 'income' ? "blue.400" : "gray.200"} display="flex" alignItems="center" justifyContent="center" cursor="pointer" bg={transactionType == 'income' ? 'blue.50' : 'white'} _hover={{bg:'gray.50'}}>
                    <Text fontSize="xl" color="gray.700">
                      Income
                    </Text>
                  </Box>
                </HStack> 
            </Box>
            {/* Transaction Type Picker END */}

            {/* Is Recurring Picker */}
            <Box my="20px">
              <Checkbox
                isChecked={isRecurring}
                onChange={(e: SyntheticEvent) => {
                  let checkbox = (e.target as HTMLInputElement)
                  setIsRecurring(checkbox.checked)
                }}
                >Is Recurring?</Checkbox>
                </Box>
            {/* Is Recurring Picker END */}

            <Box my="20px">
              <Text color="gray.600">Currency</Text>
                  <Select required placeholder="Select Currency" onChange={(e: SyntheticEvent) => {
                    let target = (e.target as HTMLInputElement)
                    setCurrency(target.value)
              }} value={currency}>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="CHF">CHF</option>
                <option value="RSD">RSD</option>
              </Select>
            </Box>

                <Box my="20px">
                  <Text color="gray.600">Date</Text>
                  <Input type="date" required value={date} onChange={(e: SyntheticEvent) => {
                    let input = (e.target as HTMLInputElement)
                    setDate(input.value)
                    console.log(input.value)
                  }} />
                </Box>                


            <Box my="20px">
              <Text color="gray.600">Amount</Text>
              <NumberInput value={amount} onChange={(valueAsNumber) => {
                // console.log(valueAsNumber)
                  if (valueAsNumber) {
                    setAmount(parseInt(valueAsNumber))
                  } else {
                    setAmount(0)
                  }
                }}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            <Box>
              <Center>
                <AppButton type="submit" isLoading={isLoading}>ADD</AppButton>
              </Center>
              </Box>
          </form>
          </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
}

export default NewTransactionDrawer