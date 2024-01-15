import {Reaction} from "./reaction.class";

export class Thread {
    id: string;
    authorId: string | null;
    title: string;
    toChannel: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: Reaction[] = [];

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.authorId = obj.authorId ?? '';
            this.title = obj.title ?? '';
            this.toChannel = obj.toChannel ?? '';
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
            this.reactions = obj.reactions ?? [];
        } else {
            this.id = '';
            this.authorId = '';
            this.title = '';
            this.toChannel = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
            this.reactions = [];
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            authorId: this.authorId,
            title: this.title,
            toChannel: this.toChannel,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            reactions: this.reactions
        };
    }
}
