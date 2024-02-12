import { FC, ReactNode, useState } from 'react'
import { InputItem, ModalLayout } from '../../Layouts'
import { ModalBody, Flex, Text, Box, ModalCloseButton, Textarea, Button, useToast, Spinner, useMediaQuery } from '@chakra-ui/react'
import { WorkshopCard } from '../Workshops'
import { Workshop, WorkshopRequest } from '../../Interface/WorkshopInterface'
import md5 from 'md5'
import { collection, doc, increment, runTransaction } from 'firebase/firestore'
import { firestore } from '../../firebaseClient'
import { UserInterface } from '../../Interface/UserInterface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setModal } from '../../redux/slices/modalSlice'
import moment from 'moment'

const FormItem: FC<{
    children: ReactNode;
    label: string;
    isOptional?: boolean;
    description?: string;
    error?: boolean;
    errorMessage?: string;
}> = ({ children, label, isOptional = false, description, error, errorMessage }) => {
    return (
        <Flex gap="0.3rem" direction="column" w="100%">
            <Flex gap="0.4rem" align="flex-start" direction="column">
                <Flex direction="row" align="center" gap="0.4rem">
                    <Text fontWeight="600">{label}</Text>
                    {isOptional && <Text fontSize="12px" color="gray" fontStyle="italic">Optional</Text>}
                </Flex>
                {error && <Text fontSize="12px" color="red" fontStyle="italic">{errorMessage}</Text>}
            </Flex>
            <Text fontSize="14px" color="gray">
                {description}

            </Text>
            {children}
        </Flex>
    )
}

const JoinWorkshopModal: FC<{ data: Workshop }> = ({ data: workshop }) => {

    const toast = useToast()
    const dispatch = useDispatch()
    const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')

    const [formItems, setFormItems] = useState<FormItemInterface>({ name: "", email: "", motivation: "" })
    const [formErrors, setFormErrors] = useState<{ motivation: ErrorInterface; email: ErrorInterface; }>({ motivation: { success: true, message: "" }, email: { success: true, message: "" }  })
    const [loading, setLoading] = useState<boolean>(false)

    interface ErrorInterface { success: boolean; message: string; }
    interface FormItemInterface { name: string; email: string; motivation: string; }

    const user: UserInterface = useSelector((state: RootState) => state.user)



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

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }
        if (formItems.name === "") {
            setFormItems(prev => ({ ...prev, name: user.displayName }))
        }
        setLoading(true)
        const newWorkshopRequestId = md5(`${new Date().getTime().toString()}`)
        const workshopRequest = {
            ...formItems,
            userId: user.id,
            status: "waiting",
            name: formItems.name ?? user.displayName,
            createdAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
            updatedAt: moment(new Date()).format("DD.MM.YYYY hh:mm:ss"),
        } as WorkshopRequest
        runTransaction(firestore, async (transaction) => {
            transaction.set(
                doc(collection(firestore, `users/${user?.id}/workshopJoinRequests`), newWorkshopRequestId),
                { workshopId: workshop.id }
            );
            transaction.set(
                doc(collection(firestore, `workshops/${workshop.id}/participants`), newWorkshopRequestId),
                workshopRequest
            );
        }).finally(() => {
            setLoading(false)
            toast({
                status: "success",
                isClosable: true,
                position: "top-right",
                title: "Workshop request submitted. Currently under review. You will be notified of the outcome shortly."
            })
            dispatch(setModal({ isOpen: false, view: 'joinWorkshop' }))
        })

    }

    return (
        <ModalLayout size='xl' isCentered={false}>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                pb={6}
            >
                <Flex
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="center"
                    gap="1rem"
                    h="100%"
                >
                    {!isSmallerThan766 &&
                        <Flex minW="40%" h="100%" align="center" justify="center" pt="1rem">
                            <WorkshopCard.Desktop workshop={workshop as Workshop} />
                        </Flex>
                    }
                    <Flex direction="column" >
                        <Box marginBottom="3rem">
                            <Text align="left" fontSize={22} fontWeight={400} pb="0.4rem">
                                Join <strong>{workshop?.workshop_manager_name}</strong>'s Workshop
                            </Text>
                            <Text fontStyle="italic">
                                Let's help him run a more efficient session by filling in the form below.
                            </Text>
                        </Box>
                        <Flex gap="1rem" direction="column">
                            <FormItem label='Name' isOptional={true} >
                                <InputItem type='text' name='name' onChange={ev => setFormItems((prev) => ({ ...prev, "name": ev.target.value }))} />
                            </FormItem>
                            <FormItem label='E-mail' error={!formErrors.email.success} errorMessage={formErrors.email.message}>
                                <InputItem type='text' name='name' onChange={ev => setFormItems((prev) => ({ ...prev, "name": ev.target.value }))} />
                            </FormItem>
                            <FormItem error={!formErrors.motivation.success} errorMessage={formErrors.motivation.message} label='Could you please tell us your motivation for attending this workshop?'>
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
                            </FormItem>
                            <Button onClick={handleSubmit}>
                                {loading ? <Spinner /> : "Send"}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalLayout>
    )
}

export default JoinWorkshopModal