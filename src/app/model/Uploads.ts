import { User } from './User';

export interface UploadReportsResponse {
    imports: UploadReport[];
    uploads: UploadReport[];
}

export interface UploadReport {
    id: string,
    portfolioId: string,
    dataType: string,
    resultDocId: string,
    requested: string,
    requestor: User,
    notes: string
}

export interface UploadReportBase {

}

export interface ImportReportDetail extends UploadReportBase {
    user: User,
    templateResults: TemplateResult[];
    originalFileName: string;
    originalFileNameURI: string;
    fieldValidationErrorsList: ValidationError[];
}

export interface ValidationError {
    entity: string;
    errors: string[];
}

export interface TemplateResult {
    name: string,
    recordCount: number,
    type: string,
    recordActions: ImportRecordAction[],
    unmappedColumns: string[],
}

export interface ImportRecordAction {
    fieldActions: FieldAction[],
    record: number
}

export interface FieldAction {
    status: string, 
    field: string,
    description: string
}

export interface UploadReportDetail extends UploadReportBase {
    workRequestId: string,
    requestId: string,
    entityId: string,
    account: string,
    status: string,
    who: string,
    uploadType: string,
    uploadFiles: UploadFileReport[]
}

export interface UploadFileReport {
    fileName: string,
    type: string,
    failureCount: number,
    successCount: number,
    activity: UploadResultItem[]
}

export interface UploadResultItem {
    category: string,
    entity: string,
    message: string,
    failure: boolean
}