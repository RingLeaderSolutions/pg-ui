export interface UploadReport {
    id: string,
    portfolioId: string,
    dataType: string,
    resultDocId: string,
    requested: string,
    requestor: number,
    notes: string
}

export interface SupplyDataUploadReport {
    workRequestId: string,
    requestId: string,
    portfolioId: string,
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