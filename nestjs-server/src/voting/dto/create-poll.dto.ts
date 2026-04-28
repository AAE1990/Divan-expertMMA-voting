import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOptionDto } from './create-option.dto';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @IsDateString()
  expiresAt: string;

  @IsString()
  @IsNotEmpty()
  tournamentId: string;
}