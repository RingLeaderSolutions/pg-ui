export interface RequestState {
    value: any;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

export const initialRequestState: RequestState = {
    value: null,
    working: true,
    error: false,
    errorMessage: ""
}

export const idleInitialRequestState: RequestState = {
    value: null,
    working: false,
    error: false,
    errorMessage: ""
}