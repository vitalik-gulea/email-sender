import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { EmailDataDto } from "./email-data.dto";
import { Type } from "class-transformer";

export class SendEmailDto {
  @ApiProperty({ description: 'Recipient email address(es)', example: 'user@example.com' })
  @IsNotEmpty()
  to: string | string[];

  @ApiProperty({ description: 'Email subject', example: 'Welcome to our service' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Template name', example: 'sign-up-confirmation' })
  @IsNotEmpty()
  @IsString()
  template: string;

  @ApiProperty({ description: 'Data for template substitution', type: EmailDataDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmailDataDto)
  data?: EmailDataDto;

  @ApiProperty({ description: 'Sender email address', example: 'noreply@example.com', required: false })
  @IsOptional()
  @IsEmail()
  from?: string;
}