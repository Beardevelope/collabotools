import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { DUPLICATE_EMAIL, PASSWORD_NOT_MATCH } from './const/users-exception-message';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ) {}

    /**
     * 회원가입
     * @param createUsersDto
     */
    async signup(createUsersDto: CreateUsersDto) {
        const findUser = await this.findUserWithEmail(createUsersDto.email);

        if (findUser) {
            throw new BadRequestException(DUPLICATE_EMAIL);
        }

        if (createUsersDto.password !== createUsersDto.passwordConfirm) {
            throw new BadRequestException(PASSWORD_NOT_MATCH);
        }

        const hashedPassword = await bcrypt.hash(
            createUsersDto.password,
            +process.env.BCRYPT_SALT_ROUND,
        );

        const resultUser = await this.usersRepository.save({
            email: createUsersDto.email,
            password: hashedPassword,
            name: createUsersDto.name,
        });

        return resultUser;
    }

    /**
     * email로 유저정보 찾기
     * @param email
     */
    findUserWithEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }
}
