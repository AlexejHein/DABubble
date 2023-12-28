import {User} from "./User.class";

export class Message{
    id: string;
    body: string;
    user: User;
    toUser: User;
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
            this.user = new User();
            this.toUser = new User();
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            body: this.body,
            user: this.user.toJSON(),
            toUser: this.toUser.toJSON(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
