import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async finishPoll(pollId: string, winnerOptionId: string) {
    // 1. Проверяем, существует ли опрос и не завершен ли он уже
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true }
    });

    if (!poll) throw new NotFoundException('Голосование не найдено');
    if (poll.status === 'FINISHED') {
      throw new BadRequestException('Голосование уже было завершено ранее');
    }

    // 2. Проверяем, принадлежит ли winnerOptionId этому опросу
    const optionExists = await this.prisma.option.findFirst({
      where: { id: winnerOptionId, pollId: pollId }
    });

    if (!optionExists) {
      throw new BadRequestException('Выбранный вариант не принадлежит этому голосованию');
    }

    // 3. Запускаем транзакцию
    return this.prisma.$transaction(async (tx) => {
      // А) Обновляем статус опроса и записываем победителя
      await tx.poll.update({
        where: { id: pollId },
        data: {
          status: 'FINISHED',
          winnerOptionId: winnerOptionId
        }
      });

      // Б) Находим всех пользователей, которые угадали
      const winningVotes = poll.votes.filter(vote => vote.optionId === winnerOptionId);

      // В) Начисляем баллы победителям (+1 балл)
      // Если победителей много, updateMany эффективнее
      if (winningVotes.length > 0) {
        // Вместо updateMany проходим циклом по победителям
        for (const vote of winningVotes) {
          await tx.user.update({
            where: { id: vote.userId },
            data: {
              score: { increment: 1 },
              // Устанавливаем время получения балла равным времени, когда был сделан прогноз!
              lastScoreAt: vote.createdAt
            }
          });
        }
      }

      return {
        message: 'Голосование успешно завершено',
        winnersCount: winningVotes.length
      };
    });
  }
}
