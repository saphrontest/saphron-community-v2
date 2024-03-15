import React, { Fragment, useEffect, useState } from 'react'
import { PlatformItemDetailLayout, PlatformPageLayout } from '../Layouts'
import storeThumbnail from '../assets/images/store-thumbnail.jpg'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Meta, ProductItem } from '../Components'
import yogaMatProduct from '../assets/images/yoga-mat.jpg'

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  img: string;
}

const MarketPlace = () => {
  const [choosenProduct, setChoosenProduct] = useState<IProduct>()
  const PRODUCT_LIST = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  useEffect(() => {
    !choosenProduct && setChoosenProduct({
      price: 10,
      id: PRODUCT_LIST[0].id,
      name: `Product - ${PRODUCT_LIST[0].id}`,
      description: 'Product Description',
      img: yogaMatProduct
    })
  }, [choosenProduct])

  return (
    <PlatformPageLayout
      coverImg={storeThumbnail}
      title={'Marketplace'}
    >
      <Meta
        title={'Saphron Health | Marketplace'}
        description='Marketplace'
      />
      <Flex flex={1} gap="0.5rem">
        <Flex direction="row" align="flex-start" gap="1rem" w="100%" h="fit-content" flexWrap="wrap">
          {
            PRODUCT_LIST.map((product, idx) => (
              <ProductItem
                key={`Product_${idx}`}
                onClick={() => setChoosenProduct({ id: product.id, name: `Product - ${idx}`, price: 10, description: 'Product Description', img: yogaMatProduct })}
                isActive={choosenProduct?.id === product.id}
                item={{ name: `Product - ${idx}`, price: 10, description: 'Product Description', img: yogaMatProduct }}
              />
            ))
          }
        </Flex>
        <PlatformItemDetailLayout coverImg={yogaMatProduct} wrapperWidth="100%">
          <>
            <Flex w="100%" justify="space-between" align="center">
              <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
                {choosenProduct?.name}
              </Text>
              <Box bg="white" w="fit-content" h="fit-content" p="0.2rem 0.6rem" borderRadius="99px">
                <Text fontWeight="600" color="black">
                  {choosenProduct?.price} $
                </Text>
              </Box>
            </Flex>
          </>
          <>
            <Text fontWeight={700} align="left" mb="0.7rem">
              12.12.2023
            </Text>
            <Text fontStyle="italic" align="left" mb="0.7rem">
              {choosenProduct?.description}
            </Text>
          </>
        </PlatformItemDetailLayout>
      </Flex>
    </PlatformPageLayout>
  )
}

export default MarketPlace
