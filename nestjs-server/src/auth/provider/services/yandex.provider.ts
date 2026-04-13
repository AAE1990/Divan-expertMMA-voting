import { BaseOAuthService } from "./base-oauth.service";
import { TypeProviderOptions } from "./types/provider-options.types";
import { TypeUserInfo } from "./types/user-info.types";

export class YandexProvider extends BaseOAuthService {
    public constructor(options: TypeProviderOptions) {
        super({
            name: 'yandex',
            authorize_url: 'https://oauth.yandex.ru/authorize',
            access_url: 'https://oauth.yandex.ru/token',
            profile_url: 'https://login.yandex.ru/info?format=json',
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret
        })
    }

    public async extractUserInfo(data: YandexProfile): Promise<TypeUserInfo> {
        return super.extractUserInfo({
            email: data.emails[0],
            name: data.display_name,
            picture: data.default_avatar_id
                ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
                : undefined
        })
    }
}

interface YandexProfile extends Record<string, any> {
    aud: string
    azp: string
    email: string
    email_verified: boolean
    exp: number
    family_name?: string
    given_name: string
    hf?: string
    iat: number
    iss: string
    jti?: string
    locale?: string
    name: string
    nbf?: number
    picture: string
    sub: string
    access_token: string
    refresh_token?: string
}