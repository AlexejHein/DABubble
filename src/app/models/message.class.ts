import {User} from "./User.class";

export class Message{
    id: string;
    body: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.body = obj.body ?? '';
            this.user = obj.user ?? new User();
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.body = '';
            this.user = new User();
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            body: this.body,
            user: this.user.toJSON(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
