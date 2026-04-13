import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(userId?: string) {
    const polls = await this.prisma.poll.findMany({
      where: { status: 'OPEN' },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true } // Считаем голоса в базе
            }
          }
        },
        // Подтягиваем голос текущего юзера для этого опроса
        votes: userId ? { where: { userId } } : false
      },
      orderBy: { createdAt: 'desc' },
    });

    // Мапим данные под наш фронтенд-интерфейс
    return polls.map(poll => ({
      ...poll,
      options: poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        votesCount: opt._count.votes // Превращаем счетчик в число
      })),
      // Если в массиве votes есть запись, берем id опции
      userVoteOptionId: poll.votes?.[0]?.optionId || null
    }));
  }

  async vote(userId: string, dto: { pollId: string; optionId: string }) {
    if (!userId) {
      throw new BadRequestException('Вы должны быть авторизованы');
    }

    // Проверка: не голосовал ли юзер уже?
    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_pollId: { userId, pollId: dto.pollId }
      }
    });

    if (existingVote) {
      throw new BadRequestException('Вы уже проголосовали в этом опросе');
    }

    return this.prisma.vote.create({
      data: {
        userId,
        pollId: dto.pollId,
        optionId: dto.optionId,
      }
    });
  }

  // Метод создания нового голосования
  async create(dto: any) { // Потом заменим на CreatePollDto
    return this.prisma.poll.create({
      data: {
        question: dto.question,
        expiresAt: new Date(dto.expiresAt),
        options: {
          create: dto.options.map(text => ({ text }))
        }
      }
    });
  }

  // Метод завершения боя и начисления баллов
  async finishPoll(pollId: string, winnerOptionId: string) {
    // 1. Помечаем опрос как завершенный и ставим победителя
    const poll = await this.prisma.poll.update({
      where: { id: pollId },
      data: {
        status: 'FINISHED',
        winnerOptionId
      },
      include: { votes: true }
    });

    // 2. Ищем всех, кто угадал победителя
    const winners = poll.votes.filter(vote => vote.optionId === winnerOptionId);

    // 3. Начисляем баллы (например, +1 балл каждому победителю)
    // Используем transaction, чтобы всё прошло успешно или всё отменилось
    await this.prisma.$transaction(
      winners.map(winner =>
        this.prisma.user.update({
          where: { id: winner.userId },
          data: { score: { increment: 1 } }
        })
      )
    );

    return { winnersCount: winners.length };
  }
}
