import { FileTypeEnum } from "../enums/file-type.enum";
import { RecognitionTaskInterface } from "./recognition-task.interface";

export interface FileEntityInterface {
    id: number;
    name: string;
    url: string;
    size: number;
    createdAt: string;
    type: FileTypeEnum;
    task?: RecognitionTaskInterface;
  }