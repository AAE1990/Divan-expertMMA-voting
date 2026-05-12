import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsOptional, MaxLength, Matches } from "class-validator";

export class UpdateUserDto {
    @IsString({message: 'Имя должно быть строкой.'})
    @IsNotEmpty({ message: 'Имя обязательно для заполнения.'})
    name!: string

    @IsString({message: 'Email должен быть строкой.'})
    @IsEmail({}, {message: 'Некорректный формат email.'})
    @IsNotEmpty({ message: 'Email обязателен для заполнения.'})
    email!: string

    @IsOptional()
    @IsBoolean({ message: 'isTwoFactorEnabled должно быть булевым значением.'})
    isTwoFactorEnabled?: boolean

    @IsOptional()
    @IsString({message: 'Биография должна быть строкой.'})
    @MaxLength(100, {message: 'Биография не должна превышать 100 символов.'})
    @Matches(/^(?!.*https?:\/\/).*$/, {message: 'Биография не должна содержать ссылок.'})
    bio?: string

    @IsOptional()
    @IsString({message: 'Город должен быть строкой.'})
    @Matches(/^(?!.*https?:\/\/).*$/, {message: 'Город не должен содержать ссылок.'})
    city?: string

    @IsOptional()
    @IsString({message: 'Страна должна быть строкой.'})
    @Matches(/^(?!.*https?:\/\/).*$/, {message: 'Страна не должна содержать ссылок.'})
    country?: string

    @IsOptional()
    @IsString({message: 'YouTube username должен быть строкой.'})
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'YouTube username может содержать только буквы, цифры, точки, дефисы и подчеркивания.'})
    youtube?: string

    @IsOptional()
    @IsString({message: 'Telegram username должен быть строкой.'})
    @Matches(/^[a-zA-Z0-9_]*$/, {message: 'Telegram username может содержать только буквы, цифры и подчеркивания.'})
    telegram?: string

    @IsOptional()
    @IsString({message: 'VK username должен быть строкой.'})
    @Matches(/^[a-zA-Z0-9_.]*$/, {message: 'VK username может содержать только буквы, цифры, точки и подчеркивания.'})
    vk?: string

    @IsOptional()
    @IsString({message: 'Twitter username должен быть строкой.'})
    @Matches(/^[a-zA-Z0-9_]*$/, {message: 'Twitter username может содержать только буквы, цифры и подчеркивания.'})
    twitter?: string

    @IsOptional()
    @IsString({message: 'Instagram username должен быть строкой.'})
    @Matches(/^[a-zA-Z0-9_.]*$/, {message: 'Instagram username может содержать только буквы, цифры, точки и подчеркивания.'})
    instagram?: string
}
