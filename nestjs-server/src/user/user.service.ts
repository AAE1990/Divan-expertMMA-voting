import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthMethod } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) { }

    public async findById(id: string, page?: number, limit?: number) {
        const pageNumber = page ?? 1;
        const limitNumber = limit ?? 5;
        const skip = (pageNumber - 1) * limitNumber;

        const [user, totalVotes] = await Promise.all([
            this.prismaService.user.findUnique({
                where: {
                    id,
                },
                include: {
                    accounts: true,
                    // Добавляем историю голосов Антона
                    votes: {
                        orderBy: {
                            createdAt: 'desc' // Свежие прогнозы будут в начале списка
                        },
                        skip,
                        take: limitNumber,
                        include: {
                            poll: {
                                include: {
                                    options: true // Чтобы знать имена обоих бойцов в паре
                                }
                            },
                            option: true // Чтобы знать, на кого именно Антон сделал ставку
                        }
                    }
                }
            }),
            this.prismaService.vote.count({
                where: { userId: id }
            })
        ])

        if (!user) {
            throw new NotFoundException(
                'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
            )
        }

        return {
            ...user,
            totalVotes,
            page: pageNumber,
            limit: limitNumber
        }
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

    public async getLeaderboard(page?: number, limit?: number) {
        const pageNumber = page ?? 1;
        const limitNumber = limit ?? 20;
        const skip = (pageNumber - 1) * limitNumber;

        const [users, totalUsers] = await Promise.all([
            this.prismaService.user.findMany({
                select: {
                    id: true,
                    displayName: true,
                    picture: true,
                    score: true,
                },
                orderBy: [
                    { score: 'desc' },
                    { lastScoreAt: 'asc' }
                ],
                skip,
                take: limitNumber,
            }),
            this.prismaService.user.count()
        ]);

        return {
            users,
            totalUsers,
            page: pageNumber,
            limit: limitNumber
        };
    }
}
