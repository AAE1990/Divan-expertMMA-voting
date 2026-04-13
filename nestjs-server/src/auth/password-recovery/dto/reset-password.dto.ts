import { IsNotEmpty, IsEmail } from "class-validator";

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Введите корректный адрес электронной почты.' })
    @IsNotEmpty({ message: 'Поле email не может быть пустым.' })
    email: string
}