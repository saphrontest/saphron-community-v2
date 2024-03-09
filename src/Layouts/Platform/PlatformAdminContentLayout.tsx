import { FC, ReactNode } from 'react'
import SearchInput from '../../Components/Admin/SearchInput'
import { Flex } from '@chakra-ui/react'

const PlatformAdminContentLayout: FC<{ children: ReactNode; onSearch?: (searchWord: string) => void }> = ({
    children, onSearch
}) => {
    return (
        <>
            {onSearch && (
                <Flex justify="flex-end">
                    <SearchInput onSearch={onSearch} />
                </Flex>
            )}
            <Flex
            gap="1rem"
            direction="column"
            overflowY="scroll"
            height="calc(100vh - 250px)"
            >
                {children}
            </Flex>
        </>
    )
}

export default PlatformAdminContentLayout
