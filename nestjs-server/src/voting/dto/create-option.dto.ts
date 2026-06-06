import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  textRu!: string;

  @IsString()
  @IsNotEmpty()
  textEn!: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный URL-адрес фотографии' })
  photoUrl?: string;
}