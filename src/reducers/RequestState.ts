export interface RequestState {
    value: any;
    working: boolean;
    error: string;
}

export const initialRequestState: RequestState = {
    value: null,
    working: true,
    error: null
}