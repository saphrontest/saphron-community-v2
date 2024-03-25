import { useEffect, useState } from 'react'
import { PlatformItemDetailLayout, PlatformPageLayout } from '../Layouts'
import storeThumbnail from '../assets/images/store-thumbnail.jpg'
import { Button, Flex, Spinner, Text, useBoolean, useMediaQuery, useToast } from '@chakra-ui/react'
import { Meta, ProductItem, ProductPriceLabel } from '../Components'
import yogaMatProduct from '../assets/images/yoga-mat.jpg'
import { FirestoreError, increment } from 'firebase/firestore'
import { IUser } from '../Interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { updateUser } from '../Helpers'
import { useReward } from '../Hooks'
import { setModal } from '../redux/slices/modalSlice'

interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  img: string;
}

const MarketPlace = () => {
  const { buyRewardItem } = useReward()
  const dispatch = useDispatch()
  const toast = useToast()
  const [choosenProduct, setChoosenProduct] = useState<IProduct>()
  const [sellingLoading, { toggle: toggleSellingLoading }] = useBoolean(false)
  const user: IUser = useSelector((state: RootState) => state.user)
  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')

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
    if (!user.id) {
      toast({
        title: "Please login, first!",
        status: "error",
        isClosable: true,
      })
      dispatch(setModal({ isOpen: true, view: "login" }))
      return;
    }
    toggleSellingLoading()

    try {

      await buyRewardItem(user.id, item)

      await updateUser(user.id, { rewardPoint: increment(-item.price) })

    } catch (error) {

      if(error instanceof FirestoreError) {
        console.error(error.message)
        throw new Error(error.message)
      }

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
        {user.id ? (
          <>
            <Text>
              Balance
            </Text>
            <ProductPriceLabel price={user.rewardPoint} />
          </>
        ) : null}
      </Flex>
      <Flex flex={1} gap="0.5rem" direction={["column", "column", "row"]}>
        <Flex direction="row" align="flex-start" gap="1rem" w="100%" h="fit-content" flexWrap="wrap">
          {
            PRODUCT_LIST.map((product, idx) => (
              <ProductItem
                key={`Product_${idx}`}
                onClick={() => setChoosenProduct({ id: product.id, name: `Product - ${idx}`, price: 10, description: 'Product Description', img: yogaMatProduct })}
                isActive={choosenProduct?.id === product.id}
                item={{ name: `Product - ${idx}`, price: 10, description: 'Product Description', img: yogaMatProduct } as IProduct}
                buyItem={buyItem}
              />
            ))
          }
        </Flex>
        {!isSmallerThan766 && (
          <PlatformItemDetailLayout coverImg={yogaMatProduct} wrapperWidth="100%">
            <>
              <Flex w="100%" justify="space-between" align="center">
                <Text fontSize={22} fontWeight={700} marginBottom="0.3rem" align="left">
                  {choosenProduct?.name}
                </Text>
                <ProductPriceLabel price={choosenProduct?.price || 0} />
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
        )}

      </Flex>
    </PlatformPageLayout>
  )
}

export default MarketPlace
