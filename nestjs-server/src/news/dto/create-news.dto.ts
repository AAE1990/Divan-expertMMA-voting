import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок на русском обязателен' })
  @MaxLength(200, { message: 'Заголовок на русском не должен превышать 200 символов' })
  titleRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Заголовок на английском обязателен' })
  @MaxLength(200, { message: 'Заголовок на английском не должен превышать 200 символов' })
  titleEn!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст новости на русском обязателен' })
  contentRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст новости на английском обязателен' })
  contentEn!: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Некорректный URL изображения' })
  @MaxLength(500, { message: 'URL изображения не должен превышать 500 символов' })
  imageUrl?: string;
}