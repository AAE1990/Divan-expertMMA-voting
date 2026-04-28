export enum UserRole {
    Regular = 'REGULAR',
    Admin = 'ADMIN',
}

export enum AuthMethod {
    Credentials = 'CREDENTIALS',
    Google = 'GOOGLE',
    Yandex = 'YANDEX',
}

export interface IAccount {
    id: string
    createdAt: string
    updatedAt: string
    type: string
    provider: string
    refreshToken: string
    accessToken: string
    expiresAt: string
    userId: string
}

export interface IUserVote {
    id: string
    createdAt: string
    optionId: string
    // Тот самый include, который мы добавили на бэкенде:
    option: {
      id: string
      text: string // Имя бойца, на которого поставил
    }
    poll: {
      id: string
      question: string
      status: 'OPEN' | 'CLOSED' | 'FINISHED'
      winnerOptionId: string | null // Кто победил в реальности
      options: {
        id: string
        text: string
      }[]
    }
  }

export interface IUser {
    id: string
    score: number
    createdAt: string
    updatedAt: string
    email: string
    password: string
    displayName: string
    picture: string
    role: UserRole
    isVerified: boolean
    isTwoFactorEnabled: boolean
    method: AuthMethod
    accounts: IAccount[]
    votes: IUserVote[] 
}
