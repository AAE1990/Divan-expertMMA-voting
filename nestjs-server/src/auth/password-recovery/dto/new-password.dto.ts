import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class NewPasswordDto {
    @IsString({ message: 'Пароль должен быть строкой.' })
    @MinLength(8, {
        message: 'Пароль должен содержать минимум 8 символов.'
    })
    @IsNotEmpty({ message: 'Новый пароль обязателен для заполнения.' })
    password: string
}