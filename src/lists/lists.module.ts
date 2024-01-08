import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsModel } from './entities/lists.entity';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
    imports: [TypeOrmModule.forFeature([ListsModel, WorkspacesModel])],
    controllers: [ListsController],
    providers: [ListsService],
})
export class ListsModule {}
