export interface IEmailService {
  sendPasswordRecoveryEmail(to: string, token: string): Promise<void>;
}
