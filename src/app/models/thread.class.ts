export class Thread {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.title = obj.title ?? '';
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.title = '';
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            title: this.title,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
