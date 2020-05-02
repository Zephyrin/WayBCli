import { Have } from './have';

export class User {
    id: number;
    gender: string;
    username: string;
    password: string;
    email: string;
    roles: string[];
    enabled: boolean;
    token?: string;
    haves: Have[];
}
