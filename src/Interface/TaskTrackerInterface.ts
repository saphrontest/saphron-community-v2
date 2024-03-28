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

export type IUserTask = ITask | {
    progress: number;
}