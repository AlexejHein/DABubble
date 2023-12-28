export class Thread {
    id: string;
    authorName: string | null;
    authorId: string | null;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.authorName = obj.authorName ?? '';
            this.authorId = obj.authorId ?? '';
            this.title = obj.title ?? '';
            this.description = obj.description ?? '';
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.authorName = '';
            this.authorId = '';
            this.title = '';
            this.description = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            authorName: this.authorName,
            authorId: this.authorId,
            title: this.title,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
