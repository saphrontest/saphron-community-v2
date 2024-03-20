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