import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { NOT_MATCH_TOKEN_TYPE } from '../const/auth-excption-message';

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authorizationToken = req.headers.authorization;

        const extractToken = this.authService.extractToken(authorizationToken, true);
        const userInfo = this.authService.verifyToken(extractToken);

        req.userId = userInfo.id;
        req.type = userInfo.type;
        req.token = extractToken;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.type !== 'access') {
            throw new UnauthorizedException(NOT_MATCH_TOKEN_TYPE);
        }

        return true;
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.type !== 'refresh') {
            throw new UnauthorizedException(NOT_MATCH_TOKEN_TYPE);
        }

        return true;
    }
}
