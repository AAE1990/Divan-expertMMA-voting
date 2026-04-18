import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TournamentController],
  providers: [TournamentService, PrismaService],
})
export class TournamentModule {}
