import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import SearchResultsItem from '../Nav/Partials/SearchResultsItem'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { SearchItemInterface } from '../../Interface/SearchInterface'
import NoEntry from '../NoEntry'

const RecentSearches = () => {
    const {recentSearches} = useSelector((state: RootState) => state.search)
    return (
        <Flex direction={"column"} w="100%">
            <Heading fontSize={22} fontWeight={500} mb={2} textAlign="left">
                Recent Searches
            </Heading>
            <Flex direction="column" w={"100%"} gap={1}>
                {!!recentSearches.length ? recentSearches.map((item: SearchItemInterface) => <SearchResultsItem key={item.id} item={item}/>) : <NoEntry type="search"/>}
            </Flex>
        </Flex>
    )
}

export default RecentSearches