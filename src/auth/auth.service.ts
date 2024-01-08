import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
    EMPTY_USER,
    EXPIRE_TOKEN,
    INVALID_TOKEN,
    NOT_EQUALS_PASSWORD,
} from './const/auth-excption-message';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 로그인 검증하기
     * @param user
     * @returns
     */
    async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
        const userInfo = await this.usersService.findUserWithEmail(user.email);

        if (!userInfo) {
            throw new NotFoundException(EMPTY_USER);
        }

        const compare = await bcrypt.compare(user.password, userInfo.password);

        if (!compare) {
            throw new UnauthorizedException(NOT_EQUALS_PASSWORD);
        }

        return userInfo;
    }

    /**
     * 토큰 추출하기
     * @param rowToken
     */
    extractToken(rowToken: string, isBearer: boolean) {
        const splitToken = rowToken.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (splitToken[0] !== prefix) {
            throw new UnauthorizedException(INVALID_TOKEN);
        }

        return splitToken[1];
    }

    /**
     * basicToken 디코딩하기
     * @param basicToken
     * @returns
     */
    decodeBasicToken(basicToken: string) {
        const decodedToken = Buffer.from(basicToken, 'base64').toString('utf-8');
        const splitUserInfo = decodedToken.split(':');

        return {
            email: splitUserInfo[0],
            password: splitUserInfo[1],
        };
    }

    /**
     * 토큰 발급하기
     * @param user
     * @param isRefresh
     */
    signToken(user: Pick<UsersModel, 'id'>, isRefresh: boolean) {
        const token = this.jwtService.sign(
            {
                id: user.id,
                type: isRefresh ? 'refresh' : 'access',
            },
            { expiresIn: isRefresh ? '1h' : 300 },
        );

        return token;
    }

    /**
     * 토큰 검증하기
     * @param rowToken
     * @returns
     */
    verifyToken(rowToken: string) {
        try {
            const result = this.jwtService.verify(rowToken);
            return result;
        } catch (err) {
            throw new UnauthorizedException(EXPIRE_TOKEN);
        }
    }

    /**
     * 토큰 재발급
     * @param rowToken
     * @param isRefresh
     */
    rotateToken(rowToken: string, isRefresh: boolean) {
        const result = this.jwtService.verify(rowToken);

        return this.signToken(
            {
                ...result,
            },
            isRefresh,
        );
    }
}
