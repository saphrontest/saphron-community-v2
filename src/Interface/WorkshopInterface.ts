export interface Workshop {
    id: number;
    name: string;
    manager: string;
    date: string;
    time: string;
    category: string;
    detailedDescription?: string;
    shortDescription?: string;
}