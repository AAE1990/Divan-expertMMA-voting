import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Текст на русском обязателен' })
  @MaxLength(200, { message: 'Текст на русском не должен превышать 200 символов' })
  textRu!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст на английском обязателен' })
  @MaxLength(200, { message: 'Текст на английском не должен превышать 200 символов' })
  textEn!: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Некорректный URL-адрес фотографии' })
  @MaxLength(500, { message: 'URL фотографии не должен превышать 500 символов' })
  photoUrl?: string;
}