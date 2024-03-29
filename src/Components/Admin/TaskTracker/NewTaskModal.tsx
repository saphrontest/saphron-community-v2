import { ModalHeader, ModalCloseButton, ModalBody, Button, Flex, Checkbox, Spinner } from '@chakra-ui/react'
import { InputItem, ModalLayout } from '../../../Layouts'
import { FC, useEffect, useState } from 'react'
import { PlatformFormItem } from '../../Platform';
import { ITask, ITaskControlItem } from '../../../Interface';
import uniqid from 'uniqid'
import { MdAdd } from 'react-icons/md';
import { doc, runTransaction, Transaction } from 'firebase/firestore';
import { firestore } from '../../../firebaseClient';

const NewTaskModal: FC<{
    isOpen: boolean;
    onClose?: () => void;
    reloadState: () => void;
}> = ({ isOpen, onClose, reloadState }) => {

    const [addControlList, setAddControlList] = useState(false)
    const [task, setTask] = useState<ITask>({
        id: uniqid(),
        name: '',
        description: '',
    })
    const [controlList, setControlList] = useState<ITaskControlItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if(addControlList) {
            setControlList([{id: uniqid(), name: '', description: ''}])
        }

    }, [addControlList])

    const createTask = async () => {
        setLoading(true)
        runTransaction(firestore, async (tx: Transaction) => {
            tx.set(doc(firestore, `tasks/${task.id}`), task)
            controlList.length && controlList.forEach(item => {
                tx.set(doc(firestore, `tasks/${task.id}/controlList/${item.id}`), item)
            })
        })
        .then(() => reloadState())
        .finally(() => setLoading(false))
    }

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose}>
            <ModalHeader textAlign="left" fontSize="16px">
                Create New Task
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <PlatformFormItem label='Task Name'>
                    <InputItem type='text' name='task_name' onChange={ev => setTask(prev => ({...prev, name: ev.target.value}))}/>
                </PlatformFormItem>
                <PlatformFormItem label='Description'>
                    <InputItem type='text' name='task_description' onChange={ev => setTask(prev => ({...prev, description: ev.target.value}))}/>
                </PlatformFormItem>
                <Flex mt="1rem" direction="column">
                    <Checkbox
                    isChecked={addControlList}
                    onChange={(e) => setAddControlList(e.target.checked)}
                    >
                        Add Control List
                    </Checkbox>
                    {addControlList && (
                        <Flex bg="gray.100" p="1rem" mt="1rem" direction="column">
                            {
                                controlList.map((item, idx) => (
                                    <Flex key={item.id} direction="column" mb="1rem" border="1px solid" borderColor="gray.300" borderRadius="1rem" p="1rem">
                                        <PlatformFormItem label='Name'>
                                            <InputItem type='text' name='control_item_name' onChange={ev => {
                                                setControlList(prev => {
                                                    // Find the item in the array
                                                    const updatedList = prev.map(control => {
                                                        if (control.id === item.id) {
                                                            return { ...control, name: ev.target.value };
                                                        }
                                                        return control;
                                                    });
                                                    return updatedList; // Return the updated array
                                                })
                                            }}/>
                                        </PlatformFormItem>
                                        <PlatformFormItem label='Description'>
                                            <InputItem type='text' name='control_item_description' onChange={ev => {
                                                setControlList(prev => {
                                                    // Find the item in the array
                                                    const updatedList = prev.map(control => {
                                                        if (control.id === item.id) {
                                                            return { ...control, description: ev.target.value };
                                                        }
                                                        return control;
                                                    });
                                                    return updatedList; // Return the updated array
                                                })
                                            }}/>
                                        </PlatformFormItem>
                                        {idx !== 0 && <Flex w="100%" justify="flex-end">
                                            <Button p="0rem" variant="ghost" onClick={() => {
                                                setControlList(prev => prev.filter(i => i.id !== item.id))
                                            }}>
                                                Remove
                                            </Button>
                                        </Flex>}
                                    </Flex>
                                ))
                            }
                            <Flex w="100%" justify="center">
                                <Button w="30%"variant="outline" gap="0.4rem" onClick={() => setControlList(prev => ([...prev, {id: uniqid(), name: '', description: ''}]))}>
                                    <MdAdd size="24px"/>
                                    Add New
                                </Button>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
                <Button w={"100%"} my="1rem" onClick={createTask}>
                    {loading ? <Spinner /> : "Create New Task"}
                </Button>
            </ModalBody>
        </ModalLayout>
    )

}

export default NewTaskModal
