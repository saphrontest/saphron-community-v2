import { DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface ICheckoutSession {
    id: string;
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


export interface ISubscription {
    id: string;
    created: Timestamp;
    current_period_start: Timestamp;
    current_period_end: Timestamp;
    price: DocumentSnapshot;
    prices: DocumentSnapshot[];
    product: DocumentSnapshot;
    status: string;
    stripeLink: string;
}
