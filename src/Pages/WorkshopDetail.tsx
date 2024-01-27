import React from 'react'
import { useParams } from 'react-router-dom'

const WorkshopDetail = () => {
    const params = useParams().slug
    return (
        <div>WorkshopDetail</div>
    )
}

export default WorkshopDetail