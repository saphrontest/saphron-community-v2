import { useEffect, useState } from 'react'
import { PlatformItemDetailLayout, PlatformPageLayout } from '../Layouts'
import storeThumbnail from '../assets/images/store-thumbnail.jpg'
import { Button, Flex, Spinner, Text, useBoolean, useMediaQuery, useToast } from '@chakra-ui/react'
import { Meta, ProductItem, ProductPriceLabel } from '../Components'
import yogaMatProduct from '../assets/images/yoga-mat.jpg'
import { FirestoreError, increment } from 'firebase/firestore'
import { IRewardItem, IUser } from '../Interface'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { getUser, updateUser } from '../Helpers'
import { useReward } from '../Hooks'
import { setModal } from '../redux/slices/modalSlice'
import moment from 'moment'


const MarketPlace = () => {
  
  const toast = useToast()
  const dispatch = useDispatch()
  const { buyRewardItem, getRewardItems } = useReward()
  
  const [choosenProduct, setChoosenProduct] = useState<IRewardItem>()
  const [items, setItems] = useState<IRewardItem[]>([])

  const [isSmallerThan766] = useMediaQuery('(max-width: 766px)')
  const [sellingLoading, { toggle: toggleSellingLoading }] = useBoolean(false)
  const [balanceLoading, { toggle: toggleBalanceLoading }] = useBoolean(false)
  
  const user: IUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    toggleBalanceLoading()

    getUser(user.id)
      .finally(() => toggleBalanceLoading())

    getRewardItems()
      .then(res => res && setItems(res))
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(!choosenProduct && items.length) {
      setChoosenProduct(items[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosenProduct, items])

  const buyItem = async (item: IRewardItem) => {
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
            {balanceLoading ? <Spinner ml="1rem"/> : <ProductPriceLabel price={user.rewardPoint} />}
          </>
        ) : null}
      </Flex>
      <Flex flex={1} gap="0.5rem" direction={["column", "column", "row"]}>
        <Flex direction="row" align="flex-start" gap="1rem" w="100%" h="fit-content" flexWrap="wrap">
          {
            items.map((product, idx) => (
              <ProductItem
                key={product.id}
                onClick={() => setChoosenProduct(product)}
                isActive={choosenProduct?.id === product.id}
                item={product}
                buyItem={buyItem}
              />
            ))
          }
        </Flex>
        {(!isSmallerThan766 && choosenProduct) && (
          <PlatformItemDetailLayout coverImg={choosenProduct?.img} wrapperWidth="100%">
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
                {moment(choosenProduct?.createdAt).format("DD.MM.YYYY")}
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
