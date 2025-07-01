import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { EmailDataDto } from "./email-data.dto";

export class QuickEmailDto {
    @ApiProperty({ description: 'Recipient email address', example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    to: string;
  
    @ApiProperty({ description: 'Data for template substitution', type: EmailDataDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => EmailDataDto)
    data?: EmailDataDto;
  }