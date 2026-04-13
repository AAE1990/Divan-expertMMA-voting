import { Module } from '@nestjs/common';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],  
  controllers: [VotingController],
  providers: [VotingService, PrismaService],
})
export class VotingModule {}
