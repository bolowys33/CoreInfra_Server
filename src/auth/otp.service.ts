import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor(private readonly mailerService: MailerService) {}
  generateOTP(length: number): string {
    const characters = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      otp += characters[index];
    }

    return otp;
  }

  async sendOtpEmail(email: string, otp: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome',
      text: `Welcome ${name}. Your verification OTP code is ${otp}`,
      html: `
      <h3>Welcome ${name}</h3>
      <p>Your verification OTP code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  }
}
