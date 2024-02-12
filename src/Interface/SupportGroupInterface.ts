export type ISupportGroupStatus = "waiting" | "confirmed" | "rejected"

export interface ISupportGroup {
    id: string;
    cover_img: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    support_group_name: string;
    support_group_manager_id: string;
    support_group_manager_name: string;
    support_group_manager_avatar: string;
    support_group_manager_mail: string;
    status: ISupportGroupStatus
    participants: ISupportGroupParticipant[] | []
}



export interface ISupportGroupParticipant {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    userId: string;
    supportGroupId: string;
    motivation: string;
    status: ISupportGroupStatus;
}

export interface ISupportGroupStatusSelectOptionInterface {
    id: number;
    select: boolean;
    label: ISupportGroupStatus;
}
