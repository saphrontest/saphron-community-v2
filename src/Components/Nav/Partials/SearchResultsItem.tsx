import React, { FC } from 'react'
import { IPost } from '../../../Interface';
import { Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LinkIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { setRecentSearches } from '../../../redux/slices/searchSlice';

interface SearchResultsItemProps {
  item: IPost;
}

const SearchResultsItem: FC<SearchResultsItemProps> = ({item}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onItemClick = () => {
    navigate(`/community/post/${item.slugId}/${item.slug}`)
    dispatch(setRecentSearches(item))
  }
  return (
    <Flex
    p={2}
    gap={3}
    bg="gray.50"
    align="center"
    borderRadius={4}
    flexDirection="row"
    justify="flex-start"
    _hover={{bg: "gray.100"}}
    cursor="pointer"
    onClick={onItemClick}
    >
      <LinkIcon />
      <Flex flexDirection={"column"} align={"flex-start"}>
        <Text fontWeight={"bold"} fontSize={{base: "14px", md: "16px"}} textAlign="left">
          {item?.title}
        </Text>
        <Flex flexDirection={"row"} gap={1} fontSize={{base: "12px", md: "16px"}}>
          <Text>
            by 
          </Text>
          <Text fontWeight={"semibold"}>
            {item?.userDisplayText}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SearchResultsItem