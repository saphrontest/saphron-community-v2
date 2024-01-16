import React, { FC } from 'react'
import { Post } from '../../../Interface/PostInterface';
import { Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LinkIcon } from '@chakra-ui/icons';

interface SearchResultsItemProps {
  item: Post;
}

const SearchResultsItem: FC<SearchResultsItemProps> = ({item}) => {
  const navigate = useNavigate()
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
    onClick={(e) => navigate(`/post/${item.slug}`)}
    >
      <LinkIcon />
      <Flex flexDirection={"column"} align={"flex-start"}>
        <Text fontWeight={"bold"}>
          {item?.title}
        </Text>
        <Flex flexDirection={"row"} gap={1}>
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