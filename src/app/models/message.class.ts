import {User} from "./User.class";
import {Reaction} from "./reaction.class";

export class Message{
    id: string;
    body: string;
    user: string;
    toUser: string;
    toThread: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: Reaction[];

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.body = obj.body ?? '';
            this.user = obj.user ?? new User();
            this.toUser = obj.toUser ?? new User();
            this.toThread = obj.toThread ?? new User();
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
            this.reactions = obj.reactions ?? [];
        } else {
            this.id = '';
            this.body = '';
            this.user = '';
            this.toUser = '';
            this.toThread = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
            this.reactions = [];
        }
    }
}
