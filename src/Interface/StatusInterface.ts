export type IStatus = "waiting" | "confirmed" | "rejected"

export interface IStatusOption {
    id: number;
    select: boolean;
    label: IStatus;
}

export const SelectOptions: IStatusOption[] = [
    { id: 0, label: 'confirmed', select: false },
    { id: 1, label: 'waiting', select: true },
    { id: 2, label: 'rejected', select: false }
]