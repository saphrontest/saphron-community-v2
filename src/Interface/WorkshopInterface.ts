import { IStatus } from "./StatusInterface";


export interface Workshop {
    id: string;
    cover_img: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    detailed_description: string;
    short_description: string;
    workshop_name: string;
    workshop_manager_id: string;
    workshop_manager_name: string;
    workshop_manager_avatar: string;
    workshop_manager_mail: string;
    status: IStatus;
    participants: WorkshopRequest[] | []
}



export interface WorkshopRequest {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    userId: string;
    workshopId: string;
    motivation: string;
    status: IStatus;
}

export interface UserWorkshops {
    id: string;
    workshopId: string;
    isModerator: boolean;
}

