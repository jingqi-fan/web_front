// 后端返回的Token结构
export interface Token {
    accessExpires:number;
    accessToken: string;
    deviceId: string;
    id:string;
    refreshExpires: number;
    refreshToken: string;
    status: string;
    userId: string;
}