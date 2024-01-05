import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

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

  @Get(':workspaceId')
  async findOneWorkspace(@Param('workspaceId') workspaceId: number) {
    return await this.workspacesService.findOneWorkspace(workspaceId);
  }

  @Put(':workspaceId')
    async updateTicket(@Param('workspaceId') workspaceId: number,@Body() createworkspaceDto: CreateWorkspaceDto) {
      return await this.workspacesService.updateWorkspace(workspaceId,createworkspaceDto);
    }
  
  @Delete(':workspaceId')
  async deleteWorkspace(@Param('workspaceId') workspaceId: number) {
    return await this.workspacesService.deleteWorkspace(workspaceId);
  }
}
