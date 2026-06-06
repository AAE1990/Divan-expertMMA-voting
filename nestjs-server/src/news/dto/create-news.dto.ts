import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок на русском обязателен' })
  titleRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Заголовок на английском обязателен' })
  titleEn!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст новости на русском обязателен' })
  contentRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст новости на английском обязателен' })
  contentEn!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}