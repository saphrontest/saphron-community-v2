import { FC, useState } from 'react'
import { useSupportGroup } from '../../Hooks'
import { ISupportGroup, IUser, ErrorInterface } from '../../Interface'
import { Box, Button, Flex, Spinner, Text, Textarea, useBoolean, useToast } from '@chakra-ui/react'
import { InputItem } from '../../Layouts'
import { PlatformFormItem } from '../Platform'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setModal } from '../../redux/slices/modalSlice'
import md5 from 'md5'

const JoinSupportGroupForm: FC<{ supportGroup: ISupportGroup }> = ({ supportGroup }) => {
  const { onJoin } = useSupportGroup()
  const toast = useToast()
  const dispatch = useDispatch()
  const [loading, { toggle: toggleLoading }] = useBoolean(false)
  const user: IUser = useSelector((state: RootState) => state.user)
  const [formItems, setFormItems] = useState<{
    name: string;
    email: string;
    motivation: string;
  }>({
    name: '',
    email: '',
    motivation: '',
  })
  const [formErrors, setFormErrors] = useState<{
    motivation: ErrorInterface;
    email: ErrorInterface;
  }>({
    motivation: { success: true, message: "" },
    email: { success: true, message: "" }
  })

  const validate = () => {
    setFormErrors({
        motivation: { success: !!formItems.motivation, message: "Please, enter motivation!" },
        email: { success: !!formItems.email, message: "Please, enter e-mail!" }
    })
    if (!!formItems.motivation && !!formItems.email) {
        return true
    }
    return false
  }

  const handleJoin = () => {
    if (!validate()) {
      return;
    }
    toggleLoading()
    const newRequestId = md5(`${new Date().getTime().toString()}`)
    supportGroup.id && onJoin(supportGroup, user.id, {
      ...formItems,
      id: newRequestId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      name: formItems.name === '' ? user.username : formItems.name,
      userId: user.id,
      supportGroupId: supportGroup.id,
      status: "waiting"
    })
    .then(() => {
      toast({
        status: "success",
        isClosable: true,
        position: "top-right",
        title: "Join Support Group request submitted. Currently under review. You will be notified of the outcome shortly."
      })
      dispatch(setModal({isOpen: false, view: "joinSupportGroup", data: null}))
    })
    .finally(() => toggleLoading())
  }

  return (
    <>
      <Box marginBottom="1rem">
        {
          supportGroup.support_group_manager_name &&
            <Text align="left" fontSize={22} fontWeight={400} pb="0.4rem">
              Join <strong>{supportGroup.support_group_manager_name}</strong>'s Support Group
            </Text>
        }
        <Text fontStyle="italic">
          Let's help him run a more efficient session by filling in the form below.
        </Text>
      </Box>
      <Flex gap="1rem" direction="column">
        <PlatformFormItem label='Name' isOptional={true} >
          <InputItem type='text' name='name' onChange={ev => setFormItems((prev) => ({ ...prev, name: ev.target.value }))} />
        </PlatformFormItem>
        <PlatformFormItem label='E-mail' error={!formErrors.email.success} errorMessage={formErrors.email.message}>
          <InputItem type='text' name='name' onChange={ev => setFormItems((prev) => ({ ...prev, email: ev.target.value }))} />
        </PlatformFormItem>
        <PlatformFormItem error={!formErrors.motivation.success} errorMessage={formErrors.motivation.message} label='Could you please tell us your motivation for attending this support group?'>
          <Textarea
            width="100%"
            name='short_description'
            _placeholder={{ color: "gray.500" }}
            _hover={{
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
            bg={"gray.50"}
            borderRadius={4}
            fontSize="10pt"
            onChange={ev => setFormItems((prev) => ({ ...prev, "motivation": ev.target.value }))}
          />
        </PlatformFormItem>
        <Button onClick={handleJoin}>
          {loading ? <Spinner /> : "Send"}
        </Button>
      </Flex>
    </>
  )
}

export default JoinSupportGroupForm