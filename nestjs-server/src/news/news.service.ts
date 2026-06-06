import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать новость
  public async create(dto: CreateNewsDto) {
    const data: any = {
      titleRu: dto.titleRu,
      titleEn: dto.titleEn,
      contentRu: dto.contentRu,
      contentEn: dto.contentEn,
      imageUrl: dto.imageUrl,
    };
    // createdAt будет установлен автоматически Prisma (default(now()))
    return this.prisma.news.create({
      data,
    });
  }

  // Получить список всех новостей с пагинацией (от новых к старым)
  public async findAll(page?: number, limit?: number) {
    const pageNumber = page ?? 1;
    const limitNumber = limit ?? 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [news, totalNews] = await Promise.all([
      this.prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      this.prisma.news.count(),
    ]);

    return { news, totalNews, page: pageNumber, limit: limitNumber };
  }

  // Получить одну новость по ID
  public async findOne(id: string) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  // Обновить новость
  public async update(id: string, dto: UpdateNewsDto) {
    const data: any = {};
    if (dto.titleRu !== undefined) data.titleRu = dto.titleRu;
    if (dto.titleEn !== undefined) data.titleEn = dto.titleEn;
    if (dto.contentRu !== undefined) data.contentRu = dto.contentRu;
    if (dto.contentEn !== undefined) data.contentEn = dto.contentEn;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    // createdAt не обновляется через API, остается оригинальным
    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  // Удалить новость
  public async remove(id: string) {
    return this.prisma.news.delete({
      where: { id },
    });
  }

  // Получить последнюю новость (для главной страницы)
  public async findLatest() {
    return this.prisma.news.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}