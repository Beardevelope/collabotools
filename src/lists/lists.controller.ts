import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { OrderListDto } from './dto/order-list.dto';
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

    @Put('/:listId')
    async updateList(
        @Param('workspaceId') workspaceId: number,
        @Param('listId') listId: number,
        @Body() updateListDto: UpdateListDto,
    ) {
        return this.listsService.updateList(workspaceId, listId, updateListDto);
    }

    @Delete('/:listId')
    deleteList(@Param('workspaceId') workspaceId: number, @Param('listId') listId: number) {
        return this.listsService.deleteList(workspaceId, listId);
    }

    @Put('/:listId/order')
    updateListOrder(
        @Param('workspaceId') workspaceId: number,
        @Param('listId') listId: number,
        @Body() orderListDto: OrderListDto,
    ) {
        return this.listsService.updateListOrder(workspaceId, listId, orderListDto);
    }
}
