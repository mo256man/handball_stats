export interface User {
    id: number;
    userName: string;
    password: string;
    teamId: number;
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResponse {
    userName: string;
    password: string;
    teamId: number;
}
export interface ErrorResponse {
    error: string;
}
//# sourceMappingURL=user.d.ts.map