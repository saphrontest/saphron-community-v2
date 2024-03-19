import { DocumentSnapshot, Timestamp } from "firebase/firestore";


export interface IPrice {
    id: string;
    active: boolean;
    billing_scheme: string;
    currency: string;
    description: string;
    interval: string;
    unit_amount: number;
}
export interface IMembership {
    id: string;
    active: boolean;
    images: Array<string>;
    name: string;
    prices: IPrice[];
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
