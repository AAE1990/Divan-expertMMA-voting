import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.getOrThrow<string>('MYSQL_URI'),
                },
            },
        });
    }

    public async onModuleInit(): Promise<void> {
        await this.$connect()
    }

    public async onModuleDestroy(): Promise<void> {
        await this.$disconnect
    }
}
