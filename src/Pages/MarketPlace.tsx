import React, { Fragment, useEffect, useState } from 'react'
import { PlatformItemDetailLayout, PlatformPageLayout } from '../Layouts'
import storeThumbnail from '../assets/images/store-thumbnail.jpg'
import { Button, Flex, Spinner, Text, useBoolean } from '@chakra-ui/react'
import { Meta, ProductItem, ProductPriceLabel } from '../Components'
import yogaMatProduct from '../assets/images/yoga-mat.jpg'
import { addDoc, collection, increment } from 'firebase/firestore'
import { IUser } from '../Interface'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { updateUser } from '../Helpers'
import { firestore } from '../firebaseClient'

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  img: string;
}

const MarketPlace = () => {
  const [choosenProduct, setChoosenProduct] = useState<IProduct>()
  const [sellingLoading, {toggle: toggleSellingLoading}] = useBoolean(false)
  const user: IUser = useSelector((state: RootState) => state.user)

  const PRODUCT_LIST = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]

  useEffect(() => {
    !choosenProduct && setChoosenProduct({
      price: 10,
      id: PRODUCT_LIST[0].id,
      name: `Product - ${PRODUCT_LIST[0].id}`,
      description: 'Product Description',
      img: yogaMatProduct
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosenProduct])

  const buyItem = async (item: IProduct) => {
    toggleSellingLoading()
    try {
      await addDoc(collection(firestore, `users/${user.id}/rewardItems`), item)
      await updateUser(user.id, {
        rewardPoint: increment(-item.price)
      })
    } finally {
      toggleSellingLoading()
    }
  }

  return (
    <PlatformPageLayout
      coverImg={storeThumbnail}
      title={'Marketplace'}
      isFlexDirectionRow={false}
    >
      <Meta
        title={'Saphron Health | Marketplace'}
        description='Marketplace'
      />
      <Flex pb="1rem" align="center">
        <Text>
          Balance
        </Text>
        <ProductPriceLabel price={user.rewardPoint} />
      </Flex>
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
              <ProductPriceLabel price={choosenProduct?.price || 0}/>
            </Flex>
          </>
          <>
            <Text fontWeight={700} align="left" mb="0.7rem">
              12.12.2023
            </Text>
            <Text fontStyle="italic" align="left" mb="0.7rem">
              {choosenProduct?.description}
            </Text>
            <Flex justify="flex-end">
              <Button onClick={() => choosenProduct && buyItem(choosenProduct)}>
                {sellingLoading ? <Spinner /> : "Buy"}
              </Button>
            </Flex>
          </>
        </PlatformItemDetailLayout>
      </Flex>
    </PlatformPageLayout>
  )
}

export default MarketPlace
