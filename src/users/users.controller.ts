import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';
import { UpdateUsersDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * 회원가입
     * @param createUsersDto
     * @returns
     */
    @Post('signup')
    signup(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.signup(createUsersDto);
    }

    /**
     * 유저 상세 조회
     * @param req
     */
    @Get('user')
    @UseGuards(BearerTokenGuard)
    getUser(@Req() req: Request) {
        return this.usersService.getUser(req['userId']);
    }

    @Patch('user')
    @UseGuards(BearerTokenGuard)
    upadteUser(@Body() updateUsersDto: UpdateUsersDto, @Req() req: Request) {
        return this.usersService.updateUser(req['userId'], updateUsersDto);
    }

    /**
     * 유저 삭제
     * @param req
     * @returns
     */
    @Delete('user')
    @UseGuards(BearerTokenGuard)
    deleteUser(@Req() req: Request) {
        return this.usersService.deleteUser(req['userId']);
    }
}
