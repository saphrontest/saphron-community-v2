import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

const Meta: FC<{ title: string; description: string; }> = ({ title, description }) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
    </Helmet>
  )
}

export default Meta
