import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    signup(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.signup(createUsersDto);
    }
}
