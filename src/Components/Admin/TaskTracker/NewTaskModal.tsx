import { ModalHeader, ModalCloseButton, ModalBody, Button, Flex, Checkbox, Spinner } from '@chakra-ui/react'
import { InputItem, ModalLayout } from '../../../Layouts'
import { FC, useEffect, useState } from 'react'
import { PlatformFormItem } from '../../Platform';
import { ITask, ITaskControlItem } from '../../../Interface';
import uniqid from 'uniqid'
import { MdAdd } from 'react-icons/md';
import { useTask } from '../../../Hooks';

const NewTaskModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    reloadState: () => void;
}> = ({ isOpen, onClose, reloadState }) => {

    const { createTask } = useTask()
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

    const handleCreateTask = async () => {
        setLoading(true)
        try {
            const success = await createTask(task, controlList)
            success && reloadState()
        } catch (error) {
            
        } finally {
            onClose()
            setLoading(false)
        }
    }
    
    
    const handleControlChange = (ev: React.ChangeEvent<HTMLInputElement>, item: ITaskControlItem, type: "name" | "description") => {
        setControlList(prev => {
            // Find the item in the array
            const updatedList = prev.map(control => {
                if (control.id === item.id) {
                    return { ...control, [type]: ev.target.value };
                }
                return control;
            });
            return updatedList; // Return the updated array
        })
    }

    const removeControl = (item: ITaskControlItem) => {
        setControlList(prev => prev.filter(i => i.id !== item.id))
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
                                            <InputItem type='text' name='control_item_name' onChange={ev => handleControlChange(ev, item, "name")}/>
                                        </PlatformFormItem>
                                        <PlatformFormItem label='Description'>
                                            <InputItem type='text' name='control_item_description' onChange={ev => handleControlChange(ev, item, "description")}/>
                                        </PlatformFormItem>
                                        {idx !== 0 && <Flex w="100%" justify="flex-end">
                                            <Button p="0rem" variant="ghost" onClick={() => removeControl(item)}>
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
                <Button w={"100%"} my="1rem" onClick={handleCreateTask}>
                    {loading ? <Spinner /> : "Create New Task"}
                </Button>
            </ModalBody>
        </ModalLayout>
    )

}

export default NewTaskModal
