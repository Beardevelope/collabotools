import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { MembersDto } from './dto/invite-member.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearer.guard';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

    /**
     * 워크스페이스 생성
     * (로그인 한 사용자 가능)
     */
  @Post()
  @UseGuards(BearerTokenGuard)
  async createWorkspace(@Req() req: Request,@Body() createworkspaceDto: CreateWorkspaceDto) {
    return await this.workspacesService.createWorkspace(req['userId'],createworkspaceDto);
  }

    /**
     * 워크스페이스 조회
     * (멤버 추가된 워크스페이스만 조회)
     */
  @Get()
  @UseGuards(BearerTokenGuard)
  async findAllWorkspace(@Req() req: Request) {
    return await this.workspacesService.findAllWorkspace(req['userId']);
  }

    /**
     * 워크스페이스 수정
     * (워크스페이스 운영자만 가능)
     */
  @Put(':workspaceId')
  @UseGuards(BearerTokenGuard)
    async updateWorkspace(@Req() req: Request,@Param('workspaceId') workspaceId: number,@Body() createworkspaceDto: CreateWorkspaceDto) {
      return await this.workspacesService.updateWorkspace(req['userId'],workspaceId,createworkspaceDto);
  }
  
    /**
     * 워크스페이스 삭제
     * (워크스페이스 운영자만 가능)
     */
  @Delete(':workspaceId')
  @UseGuards(BearerTokenGuard)
  async deleteWorkspace(@Req() req: Request, @Param('workspaceId') workspaceId: number) {
    return await this.workspacesService.deleteWorkspace(req['userId'],workspaceId);
  }

    /**
     * 워크스페이스 멤버 추가
     * (워크스페이스 운영자만 가능)
     */
  @Post(':workspaceId/invite')
  @UseGuards(BearerTokenGuard)
  async inviteMember(@Req() req: Request, @Body() membersDto: MembersDto, @Param('workspaceId') workspaceId: number) {
    return await this.workspacesService.inviteMembers(req['userId'],workspaceId,membersDto);
  }
}
