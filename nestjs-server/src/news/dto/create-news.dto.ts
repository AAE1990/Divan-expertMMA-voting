import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок обязателен' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст новости обязателен' })
  content!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}