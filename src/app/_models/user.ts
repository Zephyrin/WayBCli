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
    lastLogin: Date;

    constructor(u: User = null) {
      if (u && u !== null) {
        this.id = u.id;
        this.username = u.username;
        this.gender = u.gender;
        this.password = u.password;
        this.email = u.email;
        this.roles = u.roles;
        this.enabled = u.enabled;
        this.token = u.token;
        this.haves = [];
        u.haves.forEach(h => {
          this.haves.push(new Have(h));
        });
        this.lastLogin = u.lastLogin;
      }
    }
}
