export interface User {
    id: number;
    username: string;
    email: string;
    created_on: string;
    updated_at: string;
}

export interface Game {
    id: number;
    ownerId: number;
    name: string;
    created_on: string;
    updated_at: string;
}