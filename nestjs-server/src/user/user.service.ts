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

        const [user, totalVotes, correctVotesResult] = await Promise.all([
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
            }),
            this.prismaService.$queryRaw<Array<{ count: bigint }>>`
                SELECT COUNT(*) as count
                FROM votes v
                INNER JOIN polls p ON v.poll_id = p.id
                WHERE v.user_id = ${id} AND v.option_id = p.winner_option_id
            `
        ])

        if (!user) {
            throw new NotFoundException(
                'Пользователь не найден. Пожалуйста, проверьте введенные данные.'
            )
        }

        const correctVotes = Number(correctVotesResult[0]?.count ?? 0);

        return {
            ...user,
            totalVotes,
            correctVotes,
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
                isTwoFactorEnabled: dto.isTwoFactorEnabled,
                bio: dto.bio,
                city: dto.city,
                country: dto.country,
                youtube: dto.youtube,
                telegram: dto.telegram,
                vk: dto.vk,
                twitter: dto.twitter,
                instagram: dto.instagram
            }
        })

        return updateUser
    }

    public async findPublicProfile(id: string, page?: number, limit?: number) {
        const pageNumber = page ?? 1;
        const limitNumber = limit ?? 5;
        const skip = (pageNumber - 1) * limitNumber;

        const [user, correctVotesResult] = await Promise.all([
            this.prismaService.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    displayName: true,
                    picture: true,
                    createdAt: true,
                    bio: true,
                    city: true,
                    country: true,
                    youtube: true,
                    telegram: true,
                    vk: true,
                    twitter: true,
                    instagram: true,
                    score: true,
                    lastScoreAt: true,
                    votes: {
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take: limitNumber,
                        include: {
                            poll: {
                                include: {
                                    options: true,
                                    tournament: true
                                }
                            },
                            option: true
                        }
                    },
                    _count: {
                        select: { votes: true }
                    }
                }
            }),
            this.prismaService.$queryRaw<Array<{ count: bigint }>>`
                SELECT COUNT(*) as count
                FROM votes v
                INNER JOIN polls p ON v.poll_id = p.id
                WHERE v.user_id = ${id} AND v.option_id = p.winner_option_id
            `
        ]);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const correctVotes = Number(correctVotesResult[0]?.count || 0);

        return {
            ...user,
            totalVotes: user._count.votes,
            correctVotes,
            page: pageNumber,
            limit: limitNumber
        };
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
