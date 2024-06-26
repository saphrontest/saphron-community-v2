import { useEffect, useState } from 'react'
import { PageLayout } from '../Layouts'
import { Flex } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useChat, useSupportGroup } from '../Hooks'
import { IMessage, ISupportGroup, IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { ChatActionButtons, ChatSupportGroupDetail, ChatMessages, Meta, NoEntry } from '../Components'
import { DocumentChange, QuerySnapshot, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { firestore } from '../firebaseClient'

const SupportGroupDetailPage = () => {
  const params = useParams()
  const { getChatRoomIdBySupportGroupId } = useChat()
  const { getSupportGroupBySlug } = useSupportGroup()

  const [chatId, setChatId] = useState<string>()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [supportGroup, setSupportGroup] = useState<ISupportGroup>()

  const user: IUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (params.slug) {
      getSupportGroupBySlug(params.slug)
        .then(group => {
          !!group && setSupportGroup(group)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(() => {
    if (supportGroup?.id) {
      getChatRoomIdBySupportGroupId(supportGroup.id)
        .then(id => setChatId(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportGroup])

  useEffect(() => {
    if (supportGroup && chatId) {
      const chatRef = query(collection(firestore, `supportGroups/${supportGroup.id}/chatRoom/${chatId}/messages`), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(chatRef, onSuccess, error => console.error(error), () => console.log('onCompletion'));
      return () => unsubscribe()
    }
  }, [supportGroup, chatId])

  const onSuccess = (snapshot: QuerySnapshot) => {
    snapshot.docChanges()
    .forEach((change: DocumentChange) => {
        if(change.type === "added") {
          setMessages((prev: IMessage[]) => ([...prev, change.doc.data() as IMessage]))
        }
    });
  }


  return supportGroup ? (
    <PageLayout leftWidth='100%'>
      <Flex w="100%" bg="white" direction="column" align="flex-start" p="1rem" gap="1rem">
        <Meta
          title={`Saphron Health | ${supportGroup?.support_group_name}`}
          description={supportGroup.description as string}
        />
        <ChatSupportGroupDetail supportGroup={supportGroup} />
        <Flex
          border="5px solid"
          borderColor="gray.100"
          w="100%"
          borderRadius="1rem"
          p="1rem"
          direction="column"
          justify="space-between"
        >
          {
            chatId ? (
              <>
                <ChatMessages
                messages={messages}
                adminId={supportGroup.support_group_manager_id}
                />
                <ChatActionButtons
                chatId={chatId}
                supportGroupId={supportGroup.id!}
                user={user}
                isAdmin={supportGroup.support_group_manager_id === user.id}
                isConfirmedParticipant={!!supportGroup?.participants?.find(participant => participant.userId === user.id && participant.status === "confirmed")}
                />
            </>
            ) : <NoEntry type='chat'/>
          }
        </Flex>
      </Flex>
      <></>
    </PageLayout>
  ) : null
}

export default SupportGroupDetailPage
