export interface QueryResult<TPayload> {
    payload?: TPayload;
    error?: string;
}