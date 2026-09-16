import { FileUploadDropzone } from "./FileUploadDropzone";
import { FileUploadItem } from "./FileUploadItem";
import { FileUploadList } from "./FileUploadList";
import { FileUploadManager } from "./FileUploadManager";
import { fileUploadItem, fileUploadList, fileUploadManager } from "./file-upload-manager-variants";

const FileUploadManagerVariants = {
  fileUploadManager,
  fileUploadList,
  fileUploadItem,
};

export {
  createSimulatedUploadAdapter,
  type SimulatedUploadAdapterOptions,
} from "./create-simulated-upload-adapter";

export type { FileUploadDropzoneProps } from "./FileUploadDropzone";
export type { FileUploadItemProps } from "./FileUploadItem";
export type { FileUploadListProps } from "./FileUploadList";
export type { FileUploadManagerProps } from "./FileUploadManager";
export type {
  FileUploadItemPropsLabels,
  UploadAdapter,
  UploadAdapterContext,
  UploadAdapterResult,
  UploadFileEntry,
  UploadProgressUpdate,
  UploadQueueLabels,
  UploadQueueState,
  UploadStatus,
  UploadValidationErrorCode,
  UploadValidationRules,
  UseUploadQueueOptions,
} from "./file-upload-manager-types";
export {
  createUploadAttemptId,
  createUploadEntryId,
  formatUploadFileSize,
  validateUploadFile,
  validationRulesToAcceptAttr,
} from "./file-upload-manager-utils";
export { useUploadQueue } from "./use-upload-queue";
export {
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
  FileUploadManager,
  FileUploadManagerVariants,
  fileUploadItem,
  fileUploadList,
  fileUploadManager,
};

export default {
  Root: FileUploadManager,
  Dropzone: FileUploadDropzone,
  List: FileUploadList,
  Item: FileUploadItem,
};
