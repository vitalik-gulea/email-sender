import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/email-send-data.dto';
import { QuickEmailDto } from './dto/email-quick.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send email with custom template' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  @ApiBody({ type: SendEmailDto })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    try {
      await this.emailService.sendEmail(sendEmailDto);
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to send email', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('sign-up-confirmation')
  @ApiOperation({ summary: 'Send registration confirmation email' })
  @ApiResponse({
    status: 200,
    description: 'Registration confirmation email sent successfully',
  })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  @ApiBody({ type: QuickEmailDto })
  async sendSignUpConfirmation(@Body() dto: QuickEmailDto) {
    try {
      await this.emailService.sendSignUpConfirmation(dto.to, dto.data || {});
      return { message: 'Sign-up confirmation email sent successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to send sign-up confirmation email',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('approved-registration')
  @ApiOperation({ summary: 'Send registration approval notification' })
  @ApiResponse({
    status: 200,
    description: 'Registration approval email sent successfully',
  })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  @ApiBody({ type: QuickEmailDto })
  async sendApprovedRegistration(@Body() dto: QuickEmailDto) {
    try {
      await this.emailService.sendApprovedRegistration(dto.to, dto.data || {});
      return { message: 'Approved registration email sent successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to send approved registration email',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('password-reset')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  @ApiBody({ type: QuickEmailDto })
  async sendPasswordReset(@Body() dto: QuickEmailDto) {
    try {
      await this.emailService.sendPasswordReset(dto.to, dto.data || {});
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to send password reset email',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update-registration')
  @ApiOperation({ summary: 'Send registration update notification' })
  @ApiResponse({
    status: 200,
    description: 'Registration update email sent successfully',
  })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  @ApiBody({ type: QuickEmailDto })
  async sendUpdateRegistration(@Body() dto: QuickEmailDto) {
    try {
      await this.emailService.sendUpdateRegistration(dto.to, dto.data || {});
      return { message: 'Update registration email sent successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to send update registration email',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
