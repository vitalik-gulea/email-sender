import { Injectable, Logger } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailData {
  userName?: string;
  userPassword?: string;
  loginPageLink?: string;
  passwordLink?: string;
  supportEmail?: string;
  supportPhone?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  contactEmail?: string;
  contactPhone?: string;
  mcNumber?: string;
  dotNumber?: string;
  fleetSize?: string;
  notes?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  data?: EmailData;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private sesClient: SESClient | null = null;
  private readonly defaultFrom =
    process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com';
  private readonly templatesPath = path.join(process.cwd(), 'src', 'templates');

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv === 'development' && (!accessKeyId || !secretAccessKey)) {
      this.logger.warn(
        'AWS credentials not configured. Running in development mode without AWS SES.',
      );
      return;
    }

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS credentials are required: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY',
      );
    }

    this.sesClient = new SESClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  private loadTemplate(templateName: string): string {
    try {
      const templatePath = path.join(
        this.templatesPath,
        `${templateName}.html`,
      );
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  private loadComponent(componentName: string): string {
    try {
      const componentPath = path.join(
        this.templatesPath,
        'components',
        `${componentName}.html`,
      );
      return fs.readFileSync(componentPath, 'utf-8');
    } catch (error) {
      this.logger.error(`Failed to load component ${componentName}:`, error);
      return '';
    }
  }

  private replaceTemplateVariables(
    template: string,
    data: EmailData = {},
  ): string {
    let processedTemplate = template;

    if (data.userName) {
      const userNameComponent = this.loadComponent('UserName');
      const userNameHtml = userNameComponent.replace('VLAD', data.userName);
      processedTemplate = processedTemplate.replace(/VLAD/g, data.userName);
    }

    if (data.userPassword) {
      const userPasswordComponent = this.loadComponent('UserPassword');
      processedTemplate = processedTemplate.replace(
        '0000000',
        data.userPassword,
      );
    }

    if (data.loginPageLink) {
      const loginPageLinkComponent = this.loadComponent('LoginPageLink');
      processedTemplate = processedTemplate.replace(
        'https://core-eld.com',
        data.loginPageLink,
      );
    }

    if (data.passwordLink) {
      const passwordLinkComponent = this.loadComponent('PasswordLink');
      processedTemplate = processedTemplate.replace(
        '{{PASSWORD_LINK}}',
        data.passwordLink,
      );
    }

    if (data.supportEmail) {
      processedTemplate = processedTemplate.replace(
        /eld24@corelines\.us/g,
        data.supportEmail,
      );
    }

    if (data.supportPhone) {
      processedTemplate = processedTemplate.replace(
        /\(509\) 579-3104/g,
        data.supportPhone,
      );
    }

    if (data.companyName) {
      processedTemplate = processedTemplate.replace(
        /Test Company/g,
        data.companyName,
      );
    }

    if (data.firstName) {
      processedTemplate = processedTemplate.replace(
        /John(?!\s+Doe)/g,
        data.firstName,
      );
    }

    if (data.lastName) {
      processedTemplate = processedTemplate.replace(
        /Doe/g,
        data.lastName,
      );
    }

    if (data.firstName && data.lastName) {
      processedTemplate = processedTemplate.replace(
        /John Doe/g,
        `${data.firstName} ${data.lastName}`,
      );
    }

    if (data.contactEmail) {
      processedTemplate = processedTemplate.replace(
        /test@example\.com/g,
        data.contactEmail,
      );
    }

    if (data.contactPhone) {
      processedTemplate = processedTemplate.replace(
        /\+1 234-567-8900/g,
        data.contactPhone,
      );
    }

    if (data.mcNumber) {
      processedTemplate = processedTemplate.replace(
        /MC123456/g,
        data.mcNumber,
      );
    }

    if (data.dotNumber) {
      processedTemplate = processedTemplate.replace(
        /12345678/g,
        data.dotNumber,
      );
    }

    if (data.fleetSize) {
      processedTemplate = processedTemplate.replace(
        /50-100/g,
        data.fleetSize,
      );
    }

    if (data.notes) {
      processedTemplate = processedTemplate.replace(
        /Looking for a scalable ELD solution/g,
        data.notes,
      );
    }

    return processedTemplate;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const template = this.loadTemplate(options.template);
      const htmlContent = this.replaceTemplateVariables(template, options.data);

      if (!this.sesClient) {
        this.logger.log(
          'Development mode: Email would be sent to:',
          options.to,
        );
        this.logger.log('Subject:', options.subject);
        this.logger.log('Template:', options.template);
        this.logger.log(
          'HTML Content preview:',
          htmlContent.substring(0, 200) + '...',
        );
        return;
      }

      const recipients = Array.isArray(options.to) ? options.to : [options.to];

      const command = new SendEmailCommand({
        Source: options.from || this.defaultFrom,
        Destination: {
          ToAddresses: recipients,
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: htmlContent,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const result = await this.sesClient.send(command);
      this.logger.log(
        `Email sent successfully. MessageId: ${result.MessageId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendSignUpConfirmation(
    to: string,
    data: EmailData = {},
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to Core ELD - Registration Confirmation',
      template: 'sign-up-confirmation',
      data,
    });
  }

  async sendApprovedRegistration(
    to: string,
    data: EmailData = {},
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Congratulations! Your Account Has Been Approved',
      template: 'approved-registration',
      data,
    });
  }

  async sendPasswordReset(to: string, data: EmailData = {}): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Password Reset - Core ELD',
      template: 'reset-password',
      data,
    });
  }

  async sendUpdateRegistration(
    to: string,
    data: EmailData = {},
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Unfortunately, Your Account Could Not Be Approved',
      template: 'update-registration',
      data,
    });
  }

  async sendAdminContactSales(
    to: string,
    data: EmailData = {},
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: '📩 New Contact Sales Request Submitted',
      template: 'admin-contact-sales',
      data,
    });
  }

  async sendAdminNewCompany(
    to: string,
    data: EmailData = {},
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'New Company Account Registration on Corelines',
      template: 'admin-new-company',
      data,
    });
  }
}
