export interface Workshop {
    id: string;
    cover_img: string;
    category: string;
    date: string;
    detailed_description: string;
    short_description: string;
    workshop_name: string;
    workshop_manager_id: string;
    workshop_manager_name: string;
    isVerified: boolean;
}

export interface WorkshopRequest {
    id: string;
    isConfirmed: boolean;
    motivation: string;
    name: string;
    workshopId: string;
}