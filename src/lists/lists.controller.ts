import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { ListsService } from './lists.service';

@Controller('workspaces/:workspaceId/list')
export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Post()
    async createList(
        @Param('workspaceId') workspaceId: number,
        @Body() createListDto: CreateListDto,
    ) {
        return await this.listsService.createList(workspaceId, createListDto);
    }

    @Get()
    async findAllLists(@Param('workspaceId') workspaceId: number) {
        return await this.listsService.findAllLists(workspaceId);
    }
}
