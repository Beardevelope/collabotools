import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsModel } from './entities/lists.entity';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { WorkspacesModel } from 'src/workspaces/entities/workspaces.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ListsModel, WorkspacesModel]), AuthModule],
    controllers: [ListsController],
    providers: [ListsService],
})
export class ListsModule {}
