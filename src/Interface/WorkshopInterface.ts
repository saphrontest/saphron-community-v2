export type WorkshopStatusTypes = "waiting" | "confirmed" | "rejected"

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
    workshop_manager_avatar: string;
    workshop_manager_mail: string;
    status: WorkshopStatusTypes
}



export interface WorkshopRequest {
    id: string;
    status: WorkshopStatusTypes;
    motivation: string;
    name: string;
    workshopId: string;
    userId: string;
    date: string;
}

export interface UserWorkshops {
    id: string;
    isModerator: boolean;
    workshopId: string;
}

export interface WorkshopStatusSelectOptionInterface {
    id: number;
    label: string;
    select: boolean;
}
