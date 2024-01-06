export class Thread {
    id: string;
    authorId: string | null;
    title: string;
    toChannel: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.authorId = obj.authorId ?? '';
            this.title = obj.title ?? '';
            this.toChannel = obj.toChannel ?? '';
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.authorId = '';
            this.title = '';
            this.toChannel = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            authorId: this.authorId,
            title: this.title,
            toChannel: this.toChannel,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
