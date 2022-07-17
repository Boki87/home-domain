import {Button} from '@chakra-ui/react'


const AppButton = (props: any) => {

    return (
        <Button
            bgGradient='linear(to-l, var(--chakra-colors-blue-400), var(--chakra-colors-teal-400))'
            shadow="md" 
            _hover={{ bgGradient: 'linear(to-r, var(--chakra-colors-blue-400), var(--chakra-colors-teal-400))' }}
            _active={{ filter: 'brightness(80%)' }}
            color="white"
            // rounded="full"
            {...props}
        >
            {props.children}
        </Button>

    )
}

export default AppButton