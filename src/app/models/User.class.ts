export class User {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id ?? '';
      this.name = obj.name ?? '';
      this.email = obj.email ?? '';
      this.password = obj.password ?? '';
      this.avatar = obj.avatar ?? '';
    } else {
      this.id = '';
      this.name = '';
      this.email = '';
      this.password = '';
      this.avatar = '';
    }
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      avatar: this.avatar
    };
  }
}
