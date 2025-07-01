import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class EmailDataDto {
    @ApiProperty({ description: 'User name', example: 'John Doe', required: false })
    @IsOptional()
    @IsString()
    userName?: string;
  
    @ApiProperty({ description: 'User password', example: 'password123', required: false })
    @IsOptional()
    @IsString()
    userPassword?: string;
  
    @ApiProperty({ description: 'Login page link', example: 'https://app.example.com/login', required: false })
    @IsOptional()
    @IsString()
    loginPageLink?: string;
  
    @ApiProperty({ description: 'Password reset link', example: 'https://app.example.com/reset?token=abc123', required: false })
    @IsOptional()
    @IsString()
    passwordLink?: string;
  
    @ApiProperty({ description: 'Support email', example: 'support@example.com', required: false })
    @IsOptional()
    @IsEmail()
    supportEmail?: string;
  
    @ApiProperty({ description: 'Support phone number', example: '+1-234-567-8900', required: false })
    @IsOptional()
    @IsString()
    supportPhone?: string;
  }
  