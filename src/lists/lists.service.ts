import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListsModel } from './entities/lists.entity';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { OrderListDto } from './dto/order-list.dto';

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(ListsModel) private readonly listsRepository: Repository<ListsModel>,
        @InjectRepository(WorkspacesModel)
        private readonly workspacesRepository: Repository<WorkspacesModel>,
    ) {}
    async createList(workspaceId: number, createListDto: CreateListDto) {
        await this.verifyWorkSpaceId(workspaceId);

        const list = this.listsRepository.create({
            workspaceId,
            title: createListDto.title,
            order: createListDto.order,
        });
        return await this.listsRepository.save(list);
    }

    async findAllLists(workspaceId: number) {
        await this.verifyWorkSpaceId(workspaceId);
        return await this.listsRepository.find({
            where: { workspaceId: workspaceId },
            order: {
                order: 'ASC',
            },
        });
    }

    async updateList(workspaceId: number, listId: number, updateListDto: UpdateListDto) {
        await this.verifyWorkSpaceId(workspaceId);
        await this.verifylistIdAndWorkspaceId(listId, workspaceId);
        await this.listsRepository.update({ id: listId }, updateListDto);
        return { message: 'lsit를 수정했습니다.' };
    }

    async deleteList(workspaceId: number, listId: number) {
        await this.verifyWorkSpaceId(workspaceId);
        await this.verifylistIdAndWorkspaceId(listId, workspaceId);
        await this.listsRepository.delete({ id: listId });
        return { message: 'lsit를 삭제했습니다.' };
    }

    async updateListOrder(workspaceId: number, listId: number, orderListDto: OrderListDto) {
        await this.verifyWorkSpaceId(workspaceId);
        await this.verifylistIdAndWorkspaceId(listId, workspaceId);
        await this.listsRepository.update({ id: listId }, orderListDto);
        return await this.listsRepository.find({
            where: { workspaceId: workspaceId },
            order: {
                order: 'ASC',
            },
        });
    }

    async verifyWorkSpaceId(workspaceId: number) {
        const existWorkspaceId = await this.workspacesRepository.findOne({
            where: { id: workspaceId },
        });
        if (!existWorkspaceId) {
            throw new BadRequestException('workSpace를 찾을 수 없습니다.');
        }
        return existWorkspaceId;
    }

    async verifylistIdAndWorkspaceId(listId: number, workspaceId: number) {
        const existlistIdAndWorkspaceId = await this.listsRepository.findOne({
            where: { id: listId, workspaceId },
        });
        if (!existlistIdAndWorkspaceId) {
            throw new BadRequestException('list를 찾을 수 없습니다.');
        }
        return existlistIdAndWorkspaceId;
    }
}
