export interface LifeApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
    map: Record<string, any>;
}