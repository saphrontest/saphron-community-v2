export interface ITask {
    id: string;
    name: string;
    description: string;
    controlList?: ITaskControlItem[]
}

export interface ITaskControlItem {
    id: string;
    name: string;
    description: string;
}

export type IUserTask = {
    id: string;
    name: string;
    description: string;
    controlList?: ITaskControlItem[]
    progress: number;
    joinedAt: string;
}