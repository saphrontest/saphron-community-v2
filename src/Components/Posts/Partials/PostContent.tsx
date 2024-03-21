import { Avatar, Flex, Icon, Image, Skeleton, Stack, Text, useMediaQuery } from '@chakra-ui/react'
import moment from 'moment'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FC } from 'react'
import { IPost } from '../../../Interface'
import { BsDot } from 'react-icons/bs'

interface PostContentProps {
  post: IPost;
  communityName: string;
}

const PostContent: FC<PostContentProps> = ({ post, communityName }) => {
  
  const [loadingImage, setLoadingImage] = useState(true);
  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')

  return (
    
    <Stack spacing={1} p="10px 10px">
      <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
          <Stack direction="row" justify="space-between" w="100%" spacing={0.6} align="center" fontSize="9pt">
            <Flex gap={1}>
              <Avatar src={post.communityImageURL} boxSize={18} />
              <Link to={`/community/community-detail/${post.communityId}`}>
                <Text
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                  onClick={(event) => event.stopPropagation()}
                >{`community/${communityName}`}</Text>
              </Link>
              <Icon as={BsDot} color="gray.500" fontSize={8} />
            </Flex>
            {post.createdAt && (
              <Link to={`/community/profile/${post.userId}`}>
                <Text color="gray.500" textAlign={"right"} _hover={{ textDecoration: "underline" }} onClick={(event) => event.stopPropagation()}>
                {!isSmallerThan766 && `by u/${post.userDisplayText}`}{" "}
                {moment(new Date(post.createdAt), "DD.MM.YYYY HH:mm:ss").fromNow()}
                </Text>
              </Link>
            )}
          </Stack>
      </Stack>
      <Text fontSize="12pt" fontWeight={600} textAlign="left">
        {post.title}
      </Text>
      <Text fontSize="10pt" noOfLines={10} textAlign={"left"} className='PostBody' dangerouslySetInnerHTML={{ __html: post.body }}></Text>
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