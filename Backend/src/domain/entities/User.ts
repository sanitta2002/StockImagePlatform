export class User {
  constructor(
    public readonly id: string | null,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public password: string
  ) {}
}