import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authorizationToken = req.headers.authorization;

        const extractToken = this.authService.extractToken(authorizationToken, false);
        const decodedToken = this.authService.decodeBasicToken(extractToken);

        const userInfo = await this.authService.authenticateWithEmailAndPassword(decodedToken);

        req.user = userInfo;

        return true;
    }
}
