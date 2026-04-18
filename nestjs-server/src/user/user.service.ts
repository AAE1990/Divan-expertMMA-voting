import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthMethod } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            include: {
                accounts: true
            }
        })

        if (!user) {
            throw new NotFoundException(
                'Пользователь не найден. Пожалуйтса, проверьте введеныые данные.'
            )
        }

        return user
    }

    public async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
            include: {
                accounts: true
            }
        })

        return user
    }

    public async create(
        email: string,
        password: string,
        displayName: string,
        picture: string,
        method: AuthMethod,
        isVerified: boolean
    ) {
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: password ? await hash(password) : '',
                displayName,
                picture,
                method,
                isVerified,
                score: 0,
                lastScoreAt: new Date()
            },
            include: {
                accounts: true
            }
        })

        return user
    }

    public async update(userId: string, dto: UpdateUserDto) {
        const user = await this.findById(userId)

        const updateUser = await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                email: dto.email,
                displayName: dto.name,
                isTwoFactorEnabled: dto.isTwoFactorEnabled
            }
        })

        return updateUser
    }

    public async getLeaderboard() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                displayName: true,
                picture: true,
                score: true,
            },
            orderBy: [
                { score: 'desc'},
                { lastScoreAt: 'asc' }
            ],
            take: 50,
        });
    }
}
