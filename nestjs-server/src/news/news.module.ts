import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '@/user/user.module';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [NewsController],
  providers: [NewsService, AuthGuard, RolesGuard],
  exports: [NewsService],
})
export class NewsModule {}