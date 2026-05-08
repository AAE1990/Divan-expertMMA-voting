import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: any) {
    return this.tournamentService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.tournamentService.findAll(pageNumber, limitNumber, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(id);
  }
}
