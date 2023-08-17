import React, { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Community } from '../Interface/CommunityInterface'

const CommunityDetail = () => {
  const location = useLocation()
  const communityId = useRef(location.pathname.split('/').at(-1)).current
  const [community, setCommunity] = useState<Community>()

  return (
    <div>CommunityDetail</div>
  )
}

export default CommunityDetail