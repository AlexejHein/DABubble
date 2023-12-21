export class File {
    id: string;
    name: string;
    path: string;
    type: FileType;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id ?? '';
            this.name = obj.name ?? '';
            this.path = obj.path ?? '';
            this.type = obj.type ?? FileType.OTHER;
            this.createdAt = obj.createdAt ?? new Date();
            this.updatedAt = obj.updatedAt ?? new Date();
        } else {
            this.id = '';
            this.name = '';
            this.path = '';
            this.type = FileType.OTHER;
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            path: this.path,
            type: this.type,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
class FileType {
  static readonly IMAGE = 'image';
  static readonly VIDEO = 'video';
  static readonly AUDIO = 'audio';
  static readonly OTHER = 'other';
}
