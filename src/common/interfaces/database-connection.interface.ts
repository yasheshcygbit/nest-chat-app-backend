export interface DatabaseInterface {
  readonly host: string;
  readonly port: string | number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
}
