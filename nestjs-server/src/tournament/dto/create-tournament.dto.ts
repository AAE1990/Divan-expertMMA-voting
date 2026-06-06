import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty({ message: 'Название турнира на русском обязательно' })
  nameRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Название турнира на английском обязательно' })
  nameEn!: string;

  @IsDateString({}, { message: 'Некорректный формат даты' })
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  descriptionRu?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;
}
