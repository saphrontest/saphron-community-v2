import { FC, useState } from 'react'
import { useSupportGroup } from '../../Hooks'
import { ISupportGroup, ISupportGroupParticipant } from '../../Interface/SupportGroupInterface'
import { Box, Button, Flex, Spinner, Text, Textarea, useBoolean } from '@chakra-ui/react'
import { InputItem } from '../../Layouts'
import { PlatformFormItem } from '../Platform'


interface ErrorInterface {
  success: boolean;
  message: string;
}

const JoinSupportGroupForm: FC<{ supportGroup: ISupportGroup }> = ({ supportGroup }) => {
  const { onJoin } = useSupportGroup()
  const [loading, { toggle: toggleLoading }] = useBoolean(false)
  const [formItems, setFormItems] = useState<ISupportGroupParticipant>({
    createdAt: '',
    updatedAt: '',
    name: '',
    email: '',
    userId: '',
    supportGroupId: '',
    motivation: '',
    status: 'waiting'
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
    
    try {
      onJoin(supportGroup, formItems)
    } catch (error) {

    } finally {
      toggleLoading()
    }
    
  }

  return (
    <>
      <Box marginBottom="3rem">
        <Text align="left" fontSize={22} fontWeight={400} pb="0.4rem">
          Join <strong>{supportGroup.support_group_manager_name}</strong>'s Support Group
        </Text>
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
        <PlatformFormItem error={!formErrors.motivation.success} errorMessage={formErrors.motivation.message} label='Could you please tell us your motivation for attending this workshop?'>
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