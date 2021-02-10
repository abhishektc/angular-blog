export class User {
  constructor(
    public userId: string,
    public username: string,
    private tokenData: string,
    private expirationDate: Date
  ) { }

  get token() {
    if (!this.expirationDate || new Date() > this.expirationDate) {
      return null;
    }
    return this.tokenData;
  }
}
