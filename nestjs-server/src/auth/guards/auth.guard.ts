import { UserService } from "@/user/user.service";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    public constructor(private readonly userService: UserService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        // Проверяем наличие сессии
        if (!request.session) {
            this.logger.warn('Сессия не найдена в запросе. Возможно, middleware сессии не подключено.');
            throw new UnauthorizedException('errors.auth.no_session');
        }
        
        if (typeof request.session.userId === 'undefined') {
            this.logger.debug(`Попытка доступа без userId в сессии. Session ID: ${request.session.id}`);
            throw new UnauthorizedException('errors.auth.no_user_id');
        }

        const user = await this.userService.findById(request.session.userId);

        if (!user) {
            this.logger.warn(`Пользователь с ID ${request.session.userId} не найден в базе данных`);
            throw new UnauthorizedException('errors.auth.user_not_found');
        }

        request.user = user;

        return true;
    }
}
