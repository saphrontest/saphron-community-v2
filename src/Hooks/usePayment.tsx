import { DocumentChange, DocumentReference, QuerySnapshot, Timestamp, Transaction, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, runTransaction, where } from "firebase/firestore";
import { firestore } from "../firebaseClient";
import { IMembership, IPrice, ISubscription } from "../Interface";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const usePayment = () => {
  const navigate = useNavigate()
  const toast = useToast()
  interface ICheckoutSession {
    cancel_url: string;
    client: string;
    created: Timestamp;
    mode: string;
    price: string;
    sessionId: string;
    success_url: string;
    url: string;
    error?: { message: string }
  }

    const getProductList = async () => {
        const productQuery = query(collection(firestore, "products"), where("active", "==", true));
        const data = await getDocs(productQuery);
        return await Promise.all(data.docs.map(async doc => {
            const pricesQuerySnapshot = await getDocs(collection(doc.ref, "prices"));
            const prices = pricesQuerySnapshot.docs.map(priceDoc => ({id: priceDoc.id, ...priceDoc.data()} as IPrice));
    
            return { id: doc.id, ...doc.data(), prices } as IMembership;
        }));
    }

    const buyMembership = async ( userId: string, membership: IMembership ) => {
     
      const checkoutSessionsDoc = collection(firestore, `users/${userId}/checkout_sessions`)
 
      try {
          await addDoc(checkoutSessionsDoc, {
            price: membership.prices[0].id,
            success_url: `${window.location.origin}/community/profile?payment_status=success&membership_type=${membership.name.split(" ")[0].toLowerCase()}`,
            cancel_url: `${window.location.origin}/community/profile?payment_status=cancel&membership_type=${membership.name.split(" ")[0].toLowerCase()}`,
          })

          onSnapshot(checkoutSessionsDoc, (snapshot: QuerySnapshot) => {
            return snapshot.docChanges()
            .map((change: DocumentChange) => {
                if(change.type === "added") {
                  const data = change.doc.data() as ICheckoutSession
                  console.log('checkout session added: ', data)
                  if(data?.error?.message) {
                    console.error(data?.error?.message)
                    toast({
                        title: data?.error?.message,
                        status: "error",
                        isClosable: true,
                        position: "top-right"
                    })
                  }

                  if(data.url) {
                    window.location.assign(data.url);
                  }
                }
                return null
            });
          })
        } catch (error) {
          console.error(error)
        }
    } 

    const checkUserMembership = async (userId: string) => {
      const userSubscriptionsDoc = collection(firestore, `users/${userId}/subscriptions`)
      const userSubscriptionsData = await getDocs(userSubscriptionsDoc)
      const userSubscription = userSubscriptionsData.docs.map(doc => ({id: doc.id,...doc.data()} as ISubscription))
      const productDoc = await getDoc(userSubscription[0].product as unknown as DocumentReference);
      return productDoc.data() as IMembership
    }

    return { getProductList, buyMembership, checkUserMembership }
}

export default usePayment
