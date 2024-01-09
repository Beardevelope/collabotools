import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesModel } from './entities/workspaces.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsModel } from 'src/lists/entities/lists.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([WorkspacesModel,ListsModel,UsersModel]),AuthModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
