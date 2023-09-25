import { FileTypeEnum } from "../enums/file-type.enum";
import { RecognitionTaskInterface } from "./recognition-task.interface";

export interface FileEntityInterface {
    id: string;
    name: string;
    url: string;
    size?: number | null;
    createdAt: string;
    type: FileTypeEnum;
    task?: RecognitionTaskInterface;
  }