import { TaskStatusEnum } from "../enums/task-status.enum";

export interface RecognitionTaskInterface{
    fileId: number;
    progress: number;
    status: TaskStatusEnum;
    result: string;
    error: string;
  }