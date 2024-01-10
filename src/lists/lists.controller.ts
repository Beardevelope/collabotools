import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { OrderListDto } from './dto/order-list.dto';
import { ListsService } from './lists.service';

@Controller('list')
export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Post(':workspaceId')
    async createList(
        @Param('workspaceId') workspaceId: number,
        @Body() createListDto: CreateListDto,
    ) {
        return await this.listsService.createList(workspaceId, createListDto);
    }

    @Get(':workspaceId')
    async findAllLists(@Param('workspaceId') workspaceId: number) {
        return await this.listsService.findAllLists(workspaceId);
    }

    @Put(':workspaceId/:id')
    async updateList(
        @Param('workspaceId') workspaceId: number,
        @Param('id') id: number,
        @Body() updateListDto: UpdateListDto,
    ) {
        return this.listsService.updateList(workspaceId, id, updateListDto);
    }

    @Delete(':workspaceId/:id')
    deleteList(@Param('workspaceId') workspaceId: number, @Param('id') id: number) {
        return this.listsService.deleteList(workspaceId, id);
    }

    @Put(':workspaceId/:id/order')
    updateListOrder(
        @Param('workspaceId') workspaceId: number,
        @Param('id') id: number,
        @Body() orderListDto: OrderListDto,
    ) {
        return this.listsService.updateListOrder(workspaceId, id, orderListDto);
    }
}
