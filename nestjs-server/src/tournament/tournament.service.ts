import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать новый турнир (UFC 300, etc.)
  public async create(dto: { nameRu: string; nameEn: string; date: string; descriptionRu?: string; descriptionEn?: string }) {
    return this.prisma.tournament.create({
      data: {
        nameRu: dto.nameRu,
        nameEn: dto.nameEn,
        date: new Date(dto.date),
        descriptionRu: dto.descriptionRu,
        descriptionEn: dto.descriptionEn,
      },
    });
  }

  // Получить список всех турниров (для админки и архива) с пагинацией и поиском
  public async findAll(page?: number, limit?: number, search?: string) {
    const pageNumber = page ?? 1;
    const limitNumber = limit ?? 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where = search
      ? {
          OR: [
            { nameRu: { contains: search, mode: 'insensitive' as const } },
            { nameEn: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [tournaments, totalTournaments] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limitNumber,
      }),
      this.prisma.tournament.count({ where }),
    ]);

    return { tournaments, totalTournaments, page: pageNumber, limit: limitNumber };
  }

  // Получить конкретный турнир со всеми его боями (для страницы турнира)
  public async findOne(id: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
      include: {
        polls: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } }
              }
            }
          }
        }
      }
    });

    if (!tournament) {
      return null;
    }

    // Добавляем поле text для обратной совместимости и убеждаемся, что textRu и textEn присутствуют
    const transformedPolls = tournament.polls.map(poll => ({
      ...poll,
      options: poll.options.map(opt => ({
        ...opt,
        text: opt.textRu, // дефолтное русское поле для обратной совместимости
      }))
    }));

    return {
      ...tournament,
      polls: transformedPolls,
    };
  }
}
