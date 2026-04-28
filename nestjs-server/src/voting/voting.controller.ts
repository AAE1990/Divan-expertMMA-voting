import { Controller, Get, Post, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { VotingService } from './voting.service';
import { CreateVotingDto } from './dto/create-voting.dto';
import { CreatePollDto } from './dto/create-poll.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard'; // Твой RolesGuard
import { Roles } from '@/auth/decorators/roles.decorator'; // Твой декоратор
import { UserRole } from '@prisma/client'; // Или твой путь к енаму

@Controller('polls')
export class VotingController {
  constructor(private readonly votingService: VotingService) { }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('tournamentId') tournamentId?: string // Достаем из URL типа ?tournamentId=...
  ) {
    const userId = req.user?.id || req.session?.userId;
    return this.votingService.findAll(userId, tournamentId);
  }

  // Роут для ОБЫЧНЫХ пользователей (голосование)
  @UseGuards(AuthGuard)
  @Post('vote')
  async vote(@Body() dto: CreateVotingDto, @Req() req: any) {
    const userId = req.user.id;
    return this.votingService.vote(userId, dto);
  }

  // Роут для АДМИНА (создание опроса)
  @Post('create') // Добавили путь 'create', чтобы не конфликтовать с 'vote'
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPoll(@Body() dto: CreatePollDto) {
    return this.votingService.create(dto);
  }

  // Роут для АДМИНА (завершение боя)
  @Post(':id/finish')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async finishPoll(
    @Param('id') id: string, 
    @Body('winnerOptionId') winnerOptionId: string
  ) {
    return this.votingService.finishPoll(id, winnerOptionId);
  }
}