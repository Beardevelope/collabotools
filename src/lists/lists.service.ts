import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListsModel } from './entities/lists.entity';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { CreateListDto } from './dto/create-list.dto';

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
        return await this.listsRepository.find({ where: { workspaceId: workspaceId } });
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
}
