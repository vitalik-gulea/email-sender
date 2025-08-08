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

    @ApiProperty({ description: 'Company name', example: 'Test Company', required: false })
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiProperty({ description: 'First name', example: 'John', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ description: 'Contact email', example: 'contact@example.com', required: false })
    @IsOptional()
    @IsEmail()
    contactEmail?: string;

    @ApiProperty({ description: 'Contact phone', example: '+1 234-567-8900', required: false })
    @IsOptional()
    @IsString()
    contactPhone?: string;

    @ApiProperty({ description: 'MC Number', example: 'MC123456', required: false })
    @IsOptional()
    @IsString()
    mcNumber?: string;

    @ApiProperty({ description: 'DOT Number', example: '12345678', required: false })
    @IsOptional()
    @IsString()
    dotNumber?: string;

    @ApiProperty({ description: 'Fleet size', example: '50-100', required: false })
    @IsOptional()
    @IsString()
    fleetSize?: string;

    @ApiProperty({ description: 'Additional notes', example: 'Looking for a scalable ELD solution', required: false })
    @IsOptional()
    @IsString()
    notes?: string;
  }
  