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

        const [user, totalVotes, correctVotesResult, rankResult] = await Promise.all([
            this.prismaService.user.findUnique({
                where: {
                    id,
                },
                include: {
                    accounts: true,
                    // Добавляем историю голосов Антона, исключая голоса "Народный чемпион"
                    votes: {
                        where: {
                            poll: {
                                isPeopleChamp: false
                            }
                        },
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
                where: {
                    userId: id,
                    poll: {
                        isPeopleChamp: false
                    }
                }
            }),
            this.prismaService.$queryRaw<Array<{ count: bigint }>>`
                SELECT COUNT(*) as count
                FROM votes v
                INNER JOIN polls p ON v.poll_id = p.id
                WHERE v.user_id = ${id} AND v.option_id = p.winner_option_id
                AND p.is_people_champ = FALSE
            `,
            this.prismaService.$queryRaw<Array<{ rank: bigint }>>`
                SELECT rn as rank FROM (
                    SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC, last_score_at ASC NULLS LAST) as rn
                    FROM users
                ) ranked WHERE id = ${id}
            `
        ])

        if (!user) {
            throw new NotFoundException({
                message: 'Пользователь не найден. Пожалуйста, проверьте введенные данные.',
                code: 'USER_NOT_FOUND'
            })
        }

        const correctVotes = Number(correctVotesResult[0]?.count ?? 0);
        const rank = Number(rankResult[0]?.rank ?? 0);

        return {
            ...user,
            totalVotes,
            correctVotes,
            rank,
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

        const [user, correctVotesResult, rankResult, totalVotesResult] = await Promise.all([
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
                        where: {
                            poll: {
                                isPeopleChamp: false
                            }
                        },
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
                    }
                }
            }),
            this.prismaService.$queryRaw<Array<{ count: bigint }>>`
                SELECT COUNT(*) as count
                FROM votes v
                INNER JOIN polls p ON v.poll_id = p.id
                WHERE v.user_id = ${id} AND v.option_id = p.winner_option_id
                AND p.is_people_champ = FALSE
            `,
            this.prismaService.$queryRaw<Array<{ rank: bigint }>>`
                SELECT rn as rank FROM (
                    SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC, last_score_at ASC NULLS LAST) as rn
                    FROM users
                ) ranked WHERE id = ${id}
            `,
            this.prismaService.vote.count({
                where: {
                    userId: id,
                    poll: {
                        isPeopleChamp: false
                    }
                }
            })
        ]);

        if (!user) {
            throw new NotFoundException({
                message: 'Пользователь не найден',
                code: 'USER_NOT_FOUND'
            });
        }

        const correctVotes = Number(correctVotesResult[0]?.count || 0);
        const rank = Number(rankResult[0]?.rank || 0);

        return {
            ...user,
            totalVotes: totalVotesResult,
            correctVotes,
            rank,
            page: pageNumber,
            limit: limitNumber
        };
    }

    public async getLeaderboard(page?: number, limit?: number, period: 'all' | 'month' | 'week' = 'all') {
        const pageNumber = page ?? 1;
        const limitNumber = limit ?? 20;
        const skip = (pageNumber - 1) * limitNumber;

        // Определяем дату начала периода (начало дня)
        let startDate: Date | null = null;
        if (period === 'week') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'month') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            startDate.setHours(0, 0, 0, 0);
        }

        if (period === 'all') {
            // Используем raw query с оконной функцией для получения глобального ранга
            const usersWithRank = await this.prismaService.$queryRaw<Array<{
                id: string;
                displayName: string;
                picture: string | null;
                score: number;
                rank: bigint;
            }>>`
                SELECT
                    u.id,
                    u."displayName" as "displayName",
                    u.picture,
                    u.score,
                    ROW_NUMBER() OVER (ORDER BY u.score DESC, u.last_score_at ASC NULLS LAST) as rank
                FROM users u
                ORDER BY u.score DESC, u.last_score_at ASC NULLS LAST
                LIMIT ${limitNumber} OFFSET ${skip}
            `;

            const totalUsers = await this.prismaService.user.count();

            // Преобразуем bigint rank в number
            const users = usersWithRank.map(user => ({
                id: user.id,
                displayName: user.displayName,
                picture: user.picture,
                score: user.score,
                rank: Number(user.rank),
            }));

            return {
                users,
                totalUsers,
                page: pageNumber,
                limit: limitNumber,
                period,
            };
        } else {
            // Агрегируем правильные голоса за период
            // Используем raw query для производительности с рангами
            const usersWithScore = await this.prismaService.$queryRaw<Array<{
                id: string;
                displayName: string;
                picture: string | null;
                score: bigint;
                rank: bigint;
            }>>`
                SELECT
                    u.id,
                    u."displayName" as "displayName",
                    u.picture,
                    COALESCE(SUM(CASE WHEN v.created_at >= ${startDate} AND p.winner_option_id = v.option_id THEN 1 ELSE 0 END), 0) as score,
                    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(CASE WHEN v.created_at >= ${startDate} AND p.winner_option_id = v.option_id THEN 1 ELSE 0 END), 0) DESC, u.last_score_at ASC NULLS LAST) as rank
                FROM users u
                LEFT JOIN votes v ON u.id = v.user_id
                LEFT JOIN polls p ON v.poll_id = p.id
                GROUP BY u.id, u."displayName", u.picture, u.last_score_at
                ORDER BY score DESC, u.last_score_at ASC NULLS LAST
                LIMIT ${limitNumber} OFFSET ${skip}
            `;

            const totalUsers = await this.prismaService.user.count();

            // Преобразуем bigint в number
            const users = usersWithScore.map(user => ({
                id: user.id,
                displayName: user.displayName,
                picture: user.picture,
                score: Number(user.score),
                rank: Number(user.rank),
            }));

            return {
                users,
                totalUsers,
                page: pageNumber,
                limit: limitNumber,
                period,
            };
        }
    }
}
