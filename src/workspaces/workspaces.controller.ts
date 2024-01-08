import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { MembersDto } from './dto/invite-member.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async createWorkspace(@Body() createworkspaceDto: CreateWorkspaceDto) {
    return await this.workspacesService.createWorkspace(createworkspaceDto);
  }

  @Get()
  async findAllWorkspace() {
    return await this.workspacesService.findAllWorkspace();
  }

  @Put(':workspaceId')
    async updateWorkspace(@Param('workspaceId') workspaceId: number,@Body() createworkspaceDto: CreateWorkspaceDto) {
      return await this.workspacesService.updateWorkspace(workspaceId,createworkspaceDto);
    }
  
  @Delete(':workspaceId')
  async deleteWorkspace(@Param('workspaceId') workspaceId: number) {
    return await this.workspacesService.deleteWorkspace(workspaceId);
  }

  @Post('invite')
  async inviteMember(@Body() membersDto: MembersDto) {
    return await this.workspacesService.inviteMembers(membersDto);
  }
}
