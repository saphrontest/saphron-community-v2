import {
  DocumentReference,
  collection,
  getDocs,
  getDoc,
  addDoc,
  query,
  where,
  doc,
  FirestoreError
} from "firebase/firestore";
import { firestore, functions } from "../firebaseClient";
import { ICheckoutSession, IMembership, IPrice, ISubscription } from "../Interface";
import { httpsCallable } from "firebase/functions";
import { FirebaseError } from "firebase/app";

const usePayment = () => {

  const getProductList = async () => {
    const productQuery = query(collection(firestore, "products"), where("active", "==", true));
    const data = await getDocs(productQuery);
    return await Promise.all(data.docs.map(async doc => {
      const pricesQuerySnapshot = await getDocs(collection(doc.ref, "prices"));
      const prices = pricesQuerySnapshot.docs.map(priceDoc => ({ id: priceDoc.id, ...priceDoc.data() } as IPrice));

      return { id: doc.id, ...doc.data(), prices } as IMembership;
    }));
  }

  const getCheckoutSessionByDocPath = async (path: string) => {
    try {
      const newSession = await getDoc(doc(firestore, path))
      const newSessionData = { id: newSession.id, ...newSession.data() } as ICheckoutSession
      return newSessionData
    } catch (error) {
      if (error instanceof FirestoreError) {
        console.error(error.message)
        throw new Error(error.message)
      }
    }
  }

  const createNewCheckoutSession = async (userId: string, membership: IMembership) => {
    try {
      const newSessionDoc = await addDoc(
        collection(firestore, `users/${userId}/checkout_sessions`),
        {
          price: membership.prices[0].id,
          success_url: `${window.location.origin}/community/profile?payment_status=success&membership_type=${membership.name.split(" ")[0].toLowerCase()}`,
          cancel_url: `${window.location.origin}/community/profile?payment_status=cancel&membership_type=${membership.name.split(" ")[0].toLowerCase()}`,
        }
      )
      return newSessionDoc as DocumentReference
    } catch (error) {
      if (error instanceof FirestoreError) {
        console.error(error.message)
        throw new Error(error.message)
      }
    }
  }

  const checkUserMembership = async (userId: string) => {

    try {

      const userSubscriptionsData = await getDocs(collection(firestore, `users/${userId}/subscriptions`))

      const userSubscription = userSubscriptionsData.docs.map(doc => (
        { id: doc.id, ...doc.data() } as ISubscription
      ))

      if (userSubscription && userSubscription[0]?.product) {
        const productDoc = await getDoc(userSubscription[0].product as unknown as DocumentReference);
        return productDoc.data() as IMembership
      } else return undefined

    } catch (error) {
      if (error instanceof FirestoreError) {
        console.error(error.message)
        throw new Error(error.message)
      }
    }
  }

  const createPortalLink = async () => {

    try {

      const functionRef = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');

      const result: any = await functionRef({
        returnUrl: `${window.location.origin}/community/profile`,
        locale: "auto", // Optional, defaults to "auto"
      });

      return result.data.url as string

    } catch (error) {
      if (error instanceof FirestoreError || error instanceof FirebaseError) {
        console.error(error.message)
        throw new Error(error.message)
      }
    }

  }

  const checkUserIsStripeCustomer = async (userId: string) => {
    try {
      const userCheckoutDoc = collection(firestore, `users/${userId}/checkout_sessions`)
      const userCheckoutSession = await getDocs(query(userCheckoutDoc))
      return !userCheckoutSession.empty
    } catch (error) {
      if (error instanceof FirestoreError || error instanceof FirebaseError) {
        console.error(error.message)
        throw new Error(error.message)
      }
    }
  }

  return {
    getProductList,
    createPortalLink,
    checkUserMembership,
    createNewCheckoutSession,
    getCheckoutSessionByDocPath,
    checkUserIsStripeCustomer
  }
}

export default usePayment
