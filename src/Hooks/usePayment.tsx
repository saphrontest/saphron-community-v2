import { getApp } from "@firebase/app";
import { getStripePayments, getProducts } from "@stripe/firestore-stripe-payments";

const usePayment = () => {
  
    const app = getApp();
    const payments = getStripePayments(app, {
        productsCollection: "products",
        customersCollection: "customers",
    });

    const getProductList = async () => {
        const products = await getProducts(payments, {
            includePrices: true,
            activeOnly: true,
          });
        return products
    }

    return {
        getProductList
    }
}

export default usePayment
