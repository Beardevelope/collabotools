import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/users.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto extends PickType(UsersModel, ['email', 'password', 'name']) {
    @IsNotEmpty()
    @IsString()
    passwordConfirm: string;
}
