import { IsEmail, IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'student1@uniplay.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Somchai' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'a541ccca-c9e0-4825-adfb-f71e1de40676' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
