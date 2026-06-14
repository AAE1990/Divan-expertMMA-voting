import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested, MaxLength, ArrayMinSize } from 'class-validator';
import { CreateOptionDto } from './create-option.dto';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty({ message: 'Вопрос на русском обязателен' })
  @MaxLength(500, { message: 'Вопрос на русском не должен превышать 500 символов' })
  questionRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Вопрос на английском обязателен' })
  @MaxLength(500, { message: 'Вопрос на английском не должен превышать 500 символов' })
  questionEn!: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'Должно быть как минимум 2 варианта ответа' })
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options!: CreateOptionDto[];

  @IsDateString({}, { message: 'Некорректный формат даты окончания' })
  @IsNotEmpty()
  expiresAt!: string;

  @IsOptional()
  @IsString()
  tournamentId?: string;

  @IsOptional()
  @IsBoolean()
  isPeopleChamp?: boolean;
}