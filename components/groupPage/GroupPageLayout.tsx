import * as React from 'react'
import {Box} from '@chakra-ui/react'
import GroupNavigation from './GroupNavigation'

interface GroupPageLayoutProps  {
    children: React.ReactNode
}

const GroupPageLayout = ({children}: GroupPageLayoutProps) => {

    return (

        <Box w="full" h="full" bg="gray.50" display="flex" flexDirection="column" position="relative" overflow="hidden">
            <Box w="full" h="full" overflow="auto" pb="70px">
                {children}
            </Box>
            <GroupNavigation />
        </Box>
    )
}

export default GroupPageLayout