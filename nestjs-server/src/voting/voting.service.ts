import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(userId?: string, tournamentId?: string, includePeopleChamp?: boolean) {
    const polls = await this.prisma.poll.findMany({
      where: {
        // Если tournamentId передан — фильтруем по нему, если нет — берем все OPEN
        ...(tournamentId ? { tournamentId } : { status: 'OPEN' }),
        // Исключаем опросы "Народный чемпион", если не указано иное
        ...(includePeopleChamp !== true ? { isPeopleChamp: false } : {})
      },
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
        text: opt.textRu, // Используем русскую версию текста
        photoUrl: opt.photoUrl, // Добавляем URL фотографии
        votesCount: opt._count.votes // Превращаем счетчик в число
      })),
      // Если в массиве votes есть запись, берем id опции
      userVoteOptionId: poll.votes?.[0]?.optionId || null
    }));
  }

  async findPeopleChampPolls(userId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const polls = await this.prisma.poll.findMany({
      where: {
        isPeopleChamp: true,
        status: 'OPEN' // возможно, показывать только открытые? Или все? Покажем все
      },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        votes: userId ? { where: { userId } } : false
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await this.prisma.poll.count({
      where: { isPeopleChamp: true }
    });

    return {
      polls: polls.map(poll => ({
        ...poll,
        options: poll.options.map(opt => ({
          id: opt.id,
          text: opt.textRu, // Используем русскую версию текста
          photoUrl: opt.photoUrl,
          votesCount: opt._count.votes
        })),
        userVoteOptionId: poll.votes?.[0]?.optionId || null
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
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
  async create(dto: CreatePollDto) {
    const data: any = {
      questionRu: dto.questionRu,
      questionEn: dto.questionEn,
      expiresAt: new Date(dto.expiresAt),
      options: {
        create: dto.options.map(option => ({
          textRu: option.textRu,
          textEn: option.textEn,
          photoUrl: option.photoUrl // Добавляем URL фотографии
        }))
      },
      isPeopleChamp: dto.isPeopleChamp ?? false
    };

    // Если передан tournamentId, привязываем турнир, иначе оставляем null
    if (dto.tournamentId) {
      data.tournament = {
        connect: { id: dto.tournamentId }
      };
    }

    return this.prisma.poll.create({ data });
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

      // В) Начисляем баллы победителям (+1 балл) только если НЕ народный чемпион
      // Если победителей много, updateMany эффективнее
      if (winningVotes.length > 0 && !poll.isPeopleChamp) {
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
        winnersCount: winningVotes.length,
        isPeopleChamp: poll.isPeopleChamp,
        pointsAwarded: !poll.isPeopleChamp && winningVotes.length > 0
      };
    });
  }
}
