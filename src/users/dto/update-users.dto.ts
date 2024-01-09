import { PartialType } from '@nestjs/mapped-types';
import { UsersModel } from '../entities/users.entity';

export class UpdateUsersDto extends PartialType(UsersModel) {}
