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
        const existWorkspaceId = await this.workspacesRepository.findOne({
            where: { id: workspaceId },
        });
        console.log('workspaceId', workspaceId);
        console.log('existWorkspaceId', existWorkspaceId);
        if (!existWorkspaceId) {
            throw new BadRequestException('workSpace를 찾을 수 없습니다.');
        }
        console.log('create', createListDto);
        const list = this.listsRepository.create(createListDto);

        console.log(list);
        return await this.listsRepository.save(list);
    }
}
