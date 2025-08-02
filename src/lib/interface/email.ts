// Mail type declaration
export interface IEmail {
  to: string;
  subject: string;
  type: string;
  context?: object;
}
