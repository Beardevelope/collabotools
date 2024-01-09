import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { DUPLICATE_EMAIL, PASSWORD_NOT_MATCH } from './const/users-exception-message';
import * as bcrypt from 'bcrypt';
import { SUCCESS_DELETE, SUCCESS_UPDATE } from './const/users-success.message';
import { UpdateUsersDto } from './dto/update-users.dto';

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

    /**
     * userId로 유저 상세조회
     * @param id
     */
    getUser(id: number) {
        return this.usersRepository.findOne({
            where: {
                id,
            },
        });
    }

    /**
     * 유저 정보 업데이트
     * @param id
     */
    updateUser(id: number, updateUsersDto: UpdateUsersDto) {
        try {
            this.usersRepository.update({ id }, { ...updateUsersDto });

            return SUCCESS_UPDATE;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    /**
     * 유저 삭제
     * @param id
     * @returns
     */
    deleteUser(id: number) {
        try {
            this.usersRepository.delete({
                id,
            });

            return SUCCESS_DELETE;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}
