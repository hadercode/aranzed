import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from '../../application/ports/email.service.interface';

@Injectable()
export class DummyEmailService implements IEmailService {
  private readonly logger = new Logger(DummyEmailService.name);

  async sendPasswordRecoveryEmail(to: string, token: string): Promise<void> {
    // This will be replaced by an external API (e.g. SendGrid, AWS SES)
    this.logger.log(
      `Sending recovery email to ${to} with link: http://localhost:3000/auth/reset-password?token=${token}`,
    );
  }
}
