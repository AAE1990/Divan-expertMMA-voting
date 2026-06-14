import { IsNotEmpty, IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty({ message: 'Название турнира на русском обязательно' })
  @MaxLength(200, { message: 'Название турнира на русском не должно превышать 200 символов' })
  nameRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Название турнира на английском обязательно' })
  @MaxLength(200, { message: 'Название турнира на английском не должно превышать 200 символов' })
  nameEn!: string;

  @IsDateString({}, { message: 'Некорректный формат даты' })
  @IsNotEmpty()
  date!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Описание на русском не должно превышать 1000 символов' })
  descriptionRu?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Описание на английском не должно превышать 1000 символов' })
  descriptionEn?: string;
}
