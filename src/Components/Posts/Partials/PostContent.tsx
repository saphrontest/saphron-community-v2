import { Avatar, Flex, Icon, Image, Skeleton, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FC } from 'react'
import { Post } from '../../../Interface/PostInterface'
import { BsDot } from 'react-icons/bs'

interface PostContentProps {
  post: Post;
  communityName: string;
}

const PostContent: FC<PostContentProps> = ({ post, communityName }) => {
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.body, 'text/html');
    doc.querySelector('a') !== null && doc.querySelector('a')?.setAttribute('target', '_blank');
  }, [post])
  
  return (
    <Stack spacing={1} p="10px 10px">
      <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
        {post.createdAt && (
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            <Flex gap={1}>
              <Avatar src={post.communityImageURL} boxSize={18} />
              <Link to={`/community-detail/${post.communityId}`}>
                <Text
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                  onClick={(event) => event.stopPropagation()}
                >{`community/${communityName}`}</Text>
              </Link>
              <Icon as={BsDot} color="gray.500" fontSize={8} />
            </Flex>
            <Text color="gray.500" textAlign={"right"}>
              Posted by u/{post.userDisplayText}{" "}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
        )}
      </Stack>
      <Text fontSize="12pt" fontWeight={600} textAlign="left">
        {post.title}
      </Text>
      <Text fontSize="10pt" textAlign={"left"} className='PostBody' dangerouslySetInnerHTML={{ __html: post.body }}></Text>
      {post.imageURL && (
        <Flex justify="center" align="center" p={2}>
          {loadingImage && (
            <Skeleton height="200px" width="100%" borderRadius={4} />
          )}
          <Image
            maxHeight="460px"
            src={post.imageURL}
            display={loadingImage ? "none" : "unset"}
            onLoad={(e) => {
              setLoadingImage(false)
            }}
            alt="Post Image"
          />
        </Flex>
      )}
    </Stack>
  )
}

export default PostContent