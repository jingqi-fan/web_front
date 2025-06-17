export interface RefreshTokenCommand {
    accessToken: string;
    refreshToken: string;
    userId: string;
    device: string;
}