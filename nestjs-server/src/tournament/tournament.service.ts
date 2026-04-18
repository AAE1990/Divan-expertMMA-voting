import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать новый турнир (UFC 300, etc.)
  public async create(dto: { name: string; date: string; description?: string }) {
    return this.prisma.tournament.create({
      data: {
        name: dto.name,
        date: new Date(dto.date),
        description: dto.description,
      },
    });
  }

  // Получить список всех турниров (для админки и архива)
  public async findAll() {
    return this.prisma.tournament.findMany({
      orderBy: { date: 'desc' },
    });
  }

  // Получить конкретный турнир со всеми его боями (для страницы турнира)
  public async findOne(id: string) {
    return this.prisma.tournament.findUnique({
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
  }
}
