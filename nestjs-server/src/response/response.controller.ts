import { Controller, Get, HttpCode, Post } from '@nestjs/common';

@Controller('response')
export class ResponseController {
    @Post()
    create(): string {
        return 'Test one Hey'
    }

    @Get()
    @HttpCode(201)
    findAll() {
        return 'Loh Pidor, test 201'
    }
}
