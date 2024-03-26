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
  /**
    * The function `getProductList` retrieves active products along with their prices from Firestore
    * using async/await syntax in TypeScript React.
    * @returns An array of objects representing active products with their corresponding prices. Each
    * object includes the product's ID, data, and an array of prices.
    */
  const getProductList = async () => {
    const productQuery = query(collection(firestore, "products"), where("active", "==", true));
    const data = await getDocs(productQuery);
    return await Promise.all(data.docs.map(async doc => {
      const pricesQuerySnapshot = await getDocs(collection(doc.ref, "prices"));
      const prices = pricesQuerySnapshot.docs.map(priceDoc => ({ id: priceDoc.id, ...priceDoc.data() } as IPrice));

      return { id: doc.id, ...doc.data(), prices } as IMembership;
    }));
  }

  /**
   * The function `getCheckoutSessionByDocPath` retrieves a checkout session from Firestore based on
   * a given document path.
   * @param {string} path - The `path` parameter in the `getCheckoutSessionByDocPath` function is a
   * string that represents the path to a document in Firestore.
   * @returns The function `getCheckoutSessionByDocPath` returns a Promise that resolves to an object
   * of type `ICheckoutSession` containing the id and data of the checkout session retrieved from
   * Firestore.
   */
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

  /**
   * The function `createNewCheckoutSession` creates a new checkout session for a user with a
   * specific membership, storing it in Firestore and returning the document reference.
   * @param {string} userId - The `userId` parameter in the `createNewCheckoutSession` function is a
   * string that represents the unique identifier of the user for whom the checkout session is being
   * created.
   * @param {IMembership} membership - The `membership` parameter in the `createNewCheckoutSession`
   * function is of type `IMembership`. It likely contains information about a user's membership,
   * such as the membership type, prices, and other relevant details.
   * @returns The `createNewCheckoutSession` function returns a `DocumentReference` object
   * representing the newly created checkout session document in Firestore.
   */
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

  /**
   * The function `checkUserMembership` retrieves a user's subscription data from Firestore and
   * returns the membership information if available.
   * @param {string} userId - The `userId` parameter is a string that represents the unique
   * identifier of a user in the system.
   * @returns The `checkUserMembership` function is returning the membership data of a user based on
   * their subscriptions. If the user has a subscription with a product associated with it, the
   * function will return the data of that product as an `IMembership` object. If the user does not
   * have a subscription or the subscription does not have a product associated with it, the function
   * will return `undefined`.
   */
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

  /**
   * The function `createPortalLink` asynchronously calls a Firebase Cloud Function to generate a
   * portal link for Stripe payments with specified return URL and locale.
   * @returns The `createPortalLink` function is returning a URL string that is obtained from the
   * result of calling the `ext-firestore-stripe-payments-createPortalLink` Cloud Function with the
   * specified parameters.
   */
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
