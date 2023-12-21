export class User {
    id: string;
    name: string;
    email: string;
    password: string;

    constructor(obj?: any) {
      if (obj) {
        this.id = obj.id ?? '';
        this.name = obj.name ?? '';
        this.email = obj.email ?? '';
        this.password = obj.password ?? '';
      } else {
        this.id = '';
        this.name = '';
        this.email = '';
        this.password = '';
      }
    }

    public toJSON(): any {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        password: this.password
      };
    }
}
