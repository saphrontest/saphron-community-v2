import React, { useState } from 'react'
import { ISupportGroup } from '../../Interface/SupportGroupInterface'
import { useSupportGroup } from '../../Hooks'
import { useBoolean, useToast } from '@chakra-ui/react'

const CreateSupportGroupForm = () => {
  const toast = useToast()
  const { onCreate } = useSupportGroup()
  const [loading, {toggle: toggleLoading}] = useBoolean(false)
  const [formItems, setFormItems] = useState<ISupportGroup>({
    cover_img: '',
    category: '',
    createdAt: '',
    updatedAt: '',
    description: '',
    support_group_name: '',
    support_group_manager_id: '',
    support_group_manager_name: '',
    support_group_manager_avatar: '',
    support_group_manager_mail: '',
    status: 'waiting'
  })

  const validate = () => {
    return true
  }

  const handleCreate = () => {

    if(!validate()) {
      return;
    }

    toggleLoading()
    try {
      onCreate(formItems)
    } catch (error) {
      
    } finally {
      toggleLoading()
    }

  }
  return (
    <div>CreateSupportGroupForm</div>
  )
}

export default CreateSupportGroupForm