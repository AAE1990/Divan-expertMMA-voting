import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateOptionDto } from './create-option.dto';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  questionRu!: string;

  @IsString()
  @IsNotEmpty()
  questionEn!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options!: CreateOptionDto[];

  @IsDateString()
  expiresAt!: string;

  @IsOptional()
  @IsString()
  tournamentId?: string;

  @IsOptional()
  @IsBoolean()
  isPeopleChamp?: boolean;
}