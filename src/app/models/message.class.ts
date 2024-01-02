import {User} from "./User.class";

export class Message{
    id: string;
    body: string;
    user: string;
    toUser: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.body = obj.body ?? '';
            this.user = obj.user ?? new User();
            this.toUser = obj.toUser ?? new User();
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.body = '';
            this.user = '';
            this.toUser = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}
