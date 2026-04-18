import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty({ message: 'Название турнира обязательно' })
  name: string;

  @IsDateString({}, { message: 'Некорректный формат даты' })
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;
}
