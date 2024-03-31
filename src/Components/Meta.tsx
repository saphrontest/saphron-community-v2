import { FC } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const Meta: FC<{ title: string; description: string; }> = ({
  title, description
}) => (
  <HelmetProvider>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  </HelmetProvider>
)

export default Meta
